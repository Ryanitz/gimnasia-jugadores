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
    setIsLoading(true);
    await registerPaymentRequest(
      payer,
      subjects[selectedSubject].name,
      parseInt(payingAmount)
    );

    getPlayerPayments();
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

  useEffect(() => {
    setIsLoading(true);
    getPlayers();
  }, []);

  useEffect(() => {
    if (payer !== "") getPlayerPayments();
  }, [payer]);

  return (
    <div className="w-full md:w-1/2 p-4 mx-auto flex flex-col">
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
          setSelectedSubject(e.target.value);
          setPayingAmount(subjects[e.target.value].amount);
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
          defaultValue={subjects[selectedSubject].amount}
          placeholder="Ingrese monto"
          className="input input-bordered w-full mb-4"
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
