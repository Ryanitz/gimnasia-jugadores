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
        parseInt(payingAmount)
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
    setSelectedSubject(aSubjectIndex);
    setPayingAmount(subjects[aSubjectIndex].amount);
    const amountInput = document.getElementById("amount");
    if (amountInput) amountInput.value = subjects[aSubjectIndex].amount;
  };

  useEffect(() => {
    setIsLoading(true);
    getPlayers();
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

      <select
        id="subject"
        defaultValue=""
        className="select select-bordered w-full mb-4"
        onChange={(e) => {
          changeSubject(e.target.value);
        }}
      >
        <option disabled value="">
          Elija un asunto
        </option>
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
          defaultValue={subjects[selectedSubject].amount}
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
