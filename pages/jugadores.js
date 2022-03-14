import React, { useState, useEffect } from "react";
import {
  getPlayerPaymentsRequest,
  getPlayersRequest,
  getSubjectsRequest,
  registerPaymentRequest,
  removePaymentRequest,
} from "./api/requests";
import PlayerPayments from "./components/playerPayments";

export default function Payments() {
  const [isLoading, setIsLoading] = useState(false);
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
      <h2 className="my-4 text-2xl font-bold text-center">Jugadores</h2>

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

      {playerPayments.length > 0 && (
        <PlayerPayments playerPayments={playerPayments} />
      )}
    </div>
  );
}
