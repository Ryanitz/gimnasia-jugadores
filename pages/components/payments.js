import React, { useState, useEffect } from "react";
import {
  getPlayerPaymentsRequest,
  getPlayersRequest,
  getSubjectsRequest,
  registerPaymentRequest,
  removePaymentRequest,
} from "../api/requests";
import PlayerPayments from "./playerPayments";

export default function Payments({ setIsLoading }) {
  const [players, setPlayers] = useState([]);
  const [payer, setPayer] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(-1);
  const [payingAmount, setPayingAmount] = useState(0);
  const [playerPayments, setPlayerPayments] = useState([]);
  const [date, setDate] = useState("");

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    getSubjects();
  };

  const getPlayerPayments = async () => {
    setPlayerPayments(await getPlayerPaymentsRequest(payer));

    setIsLoading(false);
  };

  const registerPayment = async () => {
    if (payer !== "" && selectedSubject >= 0 && payingAmount !== "") {
      setIsLoading(true);
      await registerPaymentRequest(
        payer,
        subjects[selectedSubject].name,
        parseInt(payingAmount),
        date
      );

      getPlayerPayments();
    }
  };

  const removePayment = async (aPaymentId) => {
    setIsLoading(true);
    setPlayerPayments(await removePaymentRequest(payer, aPaymentId));
    setIsLoading(false);
  };

  const getSubjects = async () => {
    setSubjects(await getSubjectsRequest());
    setIsLoading(false);
  };

  const changeSubject = (aSubjectIndex) => {
    setSelectedSubject(parseInt(aSubjectIndex));
    if (parseInt(aSubjectIndex) !== -1) {
      setPayingAmount(subjects[aSubjectIndex].amount);
      const amountInput = document.getElementById("amount");
      if (amountInput) amountInput.value = subjects[aSubjectIndex].amount;
    }
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
    setDate(date);
  };

  const setCustomDate = (aDate) => {
    const dateSplit = aDate.split("-");
    setDate(
      new Date(
        parseInt(dateSplit[0]),
        parseInt(dateSplit[1]) - 1,
        parseInt(dateSplit[2])
      )
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getPlayers();
    setTodayDate();
  }, []);

  useEffect(() => {
    if (payer !== "") getPlayerPayments();
  }, [payer]);

  return (
    <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
      <select
        id="payer"
        defaultValue=""
        className="select select-bordered w-full mb-4"
        onChange={(e) => setPayer(e.target.value)}
      >
        <option disabled value="">
          Elija un jugador
        </option>
        {players.map(({ id, name, surname }) => (
          <option value={id} key={id}>{`${surname}, ${name}`}</option>
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
        {subjects.map(({ name, amount }, index) => (
          <option value={index} key={index}>
            {name} (${amount})
          </option>
        ))}
      </select>

      {selectedSubject !== -1 && (
        <input
          id="amount"
          type="number"
          placeholder="Ingrese monto"
          defaultValue={
            selectedSubject !== -1 ? subjects[selectedSubject].amount : ""
          }
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
        />
      )}
    </div>
  );
}
