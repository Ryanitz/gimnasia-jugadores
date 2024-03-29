import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import {
  getPlayerPaymentsRequest,
  getPlayersRequest,
  getSubjectsRequest,
  registerPaymentRequest,
  removePaymentRequest,
  updatePaymentDebtRequest,
  updatePlayerPayingTypeRequest,
} from "../api/requests";
import PlayerPayments from "./playerPayments";
import SubjectsTable from "./subjectsTable";

export default function Payments({ setIsLoading }) {
  const [players, setPlayers] = useState([]);
  const [payer, setPayer] = useState(-1);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [payingAmount, setPayingAmount] = useState(0);
  const [playerPayments, setPlayerPayments] = useState([]);
  const [playerSubjectsNotPaid, setPlayerSubjectsNotPaid] = useState([]);
  const [date, setDate] = useState("");

  const { addToast } = useToasts();

  const setPayingAmountCuota = (aPayerIndex) => {
    let value = 0;
    if (aPayerIndex !== -1 && players[aPayerIndex].payingType !== 0) {
      value = feeValues[players[aPayerIndex].payingType];
    }
    setPayingAmount(value);
    const amountInput = document.getElementById("amount");
    if (amountInput) amountInput.value = value !== 0 ? value : "";
  };
  const setPayingAmountNormal = (aSubjectIndex) => {
    setPayingAmount(playerSubjectsNotPaid[aSubjectIndex].amount);
    const amountInput = document.getElementById("amount");
    if (amountInput)
      amountInput.value = playerSubjectsNotPaid[aSubjectIndex].amount;
  };

  const settingAmount = {
    cuota: setPayingAmountCuota,
    actividad: setPayingAmountNormal,
    excedente: setPayingAmountNormal,
  };

  const feeValues = [0, 3500, 5500, 8000, 12000, 24000];

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    getSubjects();
  };

  const getPlayerPayments = async () => {
    if (payer !== -1) {
      setPlayerPayments(await getPlayerPaymentsRequest(players[payer].id));
    }

    setIsLoading(false);
  };

  const registerPayment = async () => {
    if (payer !== -1 && selectedSubject >= 0 && payingAmount !== "") {
      setIsLoading(true);
      const debt = calculateDebt();

      const subject = playerSubjectsNotPaid[selectedSubject];

      const payment = await registerPaymentRequest(
        players[payer].id,
        subject.name,
        subject.type,
        parseFloat(payingAmount),
        date,
        debt ? debt : 0
      );

      addToast(`Pago de "${subject.name}" registrado`, {
        appearance: "success",
      });

      setPlayerPayments([...playerPayments, payment]);
      setIsLoading(false);
    }
  };

  const removePayment = async (aPaymentId) => {
    setIsLoading(true);
    const newPlayerPayments = playerPayments.filter(
      ({ id }) => aPaymentId !== id
    );

    await removePaymentRequest(players[payer].id, aPaymentId);

    addToast(`Pago eliminado`, {
      appearance: "success",
    });

    setPlayerPayments(newPlayerPayments);
    setIsLoading(false);
  };

  const getSubjects = async () => {
    setSubjects(await getSubjectsRequest());
    setIsLoading(false);
  };

  const changeSubject = (aSubjectIndex) => {
    setSelectedSubject(parseInt(aSubjectIndex));
    if (parseInt(aSubjectIndex) !== -1) {
      const type = playerSubjectsNotPaid[aSubjectIndex].type;
      settingAmount[type](type === "cuota" ? payer : aSubjectIndex);
    }
  };
  const changePayer = (aPayerIndex) => {
    setPayer(aPayerIndex);
  };

  const setTodayDate = () => {
    const date = new Date();
    const dateInput = document.getElementById("date");
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;

    dateInput.value = `${date.getFullYear()}-${month}-${day}`;
    setDate(new Date(date.getFullYear(), month - 1, day));
  };

  const setCustomDate = (aDate) => {
    const dateSplit = aDate.split("-");
    const date = new Date(
      parseInt(dateSplit[0]),
      parseInt(dateSplit[1]) - 1,
      parseInt(dateSplit[2])
    );
    setDate(date);
  };

  const calculateDebt = () => {
    if (playerSubjectsNotPaid[selectedSubject].type !== "cuota") return 0;

    const payingDate = new Date(date);
    const dueDate = new Date(playerSubjectsNotPaid[selectedSubject].dueDate);

    const payerData = players[payer];
    let payingType = payerData.payingType;

    if (payerData.payingType === 0) {
      const newPayingType = feeValues.indexOf(parseFloat(payingAmount));

      payingType = newPayingType;
      updatePlayerPayingTypeRequest(payerData.id, newPayingType);
    }

    let mustPay = feeValues[payingType];

    if (payingDate >= dueDate) {
      mustPay *= 1.1;
    }

    return mustPay - payingAmount;
  };

  const payOffDebt = async (aPaymentId, finalPayment) => {
    setIsLoading(true);
    setPlayerPayments(
      await updatePaymentDebtRequest(
        players[payer].id,
        aPaymentId,
        0,
        finalPayment
      )
    );
    setIsLoading(false);
  };

  const hasPaidSubject = (aSubjectName) => {
    return (
      playerPayments.filter((payment) => {
        return payment.subject === aSubjectName;
      }).length > 0
    );
  };

  const hasToPay = (aSubject) => {
    if (aSubject.payingType) {
      return aSubject.payingType >= players[payer].payingType;
    } else return true;
  };

  useEffect(() => {
    setIsLoading(true);
    getPlayers();
    setTodayDate();
  }, []);

  useEffect(() => {
    if (payer !== -1) getPlayerPayments();
  }, [payer]);

  useEffect(() => {
    if (payer !== -1) {
      setPlayerSubjectsNotPaid(
        subjects.filter((subject) => {
          return (
            subject.name === "Excedente" ||
            (!hasPaidSubject(subject.name) && hasToPay(subject))
          );
        })
      );
    }
  }, [playerPayments]);

  useEffect(() => {
    if (selectedSubject !== -1) {
      const type = playerSubjectsNotPaid[selectedSubject].type;
      settingAmount[type](type === "cuota" ? payer : selectedSubject);
    }
  }, [playerSubjectsNotPaid]);

  return (
    <div className="w-full md:w-3/4 lg:w-1/2 transition-all pb-16 mx-auto flex flex-col overflow-y-auto">
      <select
        id="payer"
        defaultValue={-1}
        className="select select-bordered w-full mb-4"
        onChange={(e) => changePayer(e.target.value)}
      >
        <option disabled value={-1}>
          Elija un jugador
        </option>
        {players.map(({ id, name, surname }, index) => (
          <option value={index} key={id}>{`${surname}, ${name}`}</option>
        ))}
      </select>

      <input
        id="date"
        type="date"
        placeholder="Ingrese monto"
        className="input input-min-height input-bordered w-full mb-4 font-semibold appearance-none text-left"
        onChange={(e) => setCustomDate(e.target.value)}
      />

      <select
        id="subject"
        className="select select-bordered w-full mb-4"
        onChange={(e) => {
          changeSubject(e.target.value);
        }}
      >
        <option value={-1}>Elija un asunto</option>
        {playerSubjectsNotPaid.map(({ name }, index) => (
          <option value={index} key={index}>
            {name}
          </option>
        ))}
      </select>

      {selectedSubject !== -1 && (
        <input
          id="amount"
          type="number"
          placeholder="Ingrese monto"
          defaultValue={payingAmount}
          className="input input-min-height input-bordered w-full mb-4"
          onChange={(e) => setPayingAmount(e.target.value)}
        />
      )}
      <button className="btn mb-4" onClick={registerPayment}>
        Registrar pago
      </button>

      {playerPayments.length > 0 && (
        <PlayerPayments
          playerPayments={playerPayments}
          removePayment={removePayment}
          payOffDebt={payOffDebt}
          isAdmin={true}
        />
      )}

      {playerSubjectsNotPaid.length > 0 && (
        <div className="overflow-x-auto w-max-screem">
          <hr />
          <h2 className="text-xl font-bold text-center my-4">
            Asuntos no pagados
          </h2>
          <SubjectsTable subjects={playerSubjectsNotPaid} hideSurplus={true} />
        </div>
      )}
    </div>
  );
}
