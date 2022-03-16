import React, { useState, useEffect } from "react";
import {
  getPlayerPaymentsRequest,
  getPlayersRequest,
  getSubjectsRequest,
} from "./api/requests";
import SubjectsTable from "./components/subjectsTable";

export default function PlayersList() {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState("");
  const [playerPayments, setPlayerPayments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [debtSubjects, setDebtSubjects] = useState([]);

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    getSubjects();
  };

  const getPlayerPayments = async () => {
    setPlayerPayments(await getPlayerPaymentsRequest(player));

    setIsLoading(false);
  };

  const getSubjects = async () => {
    setSubjects(await getSubjectsRequest());
    setIsLoading(false);
  };

  const isInPayments = (aSubjectName) => {
    return (
      playerPayments.filter(({ subject }) => subject === aSubjectName).length >
      0
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getPlayers();
  }, []);

  useEffect(() => {
    if (player !== "") getPlayerPayments();
  }, [player]);

  useEffect(() => {
    const newDebtSubjects = [];
    subjects.forEach((subject) => {
      if (subject.name !== "Excedente") {
        if (!isInPayments(subject.name)) {
          newDebtSubjects.push(subject);
        }
      }
    });
    setDebtSubjects(newDebtSubjects);
  }, [playerPayments]);

  return (
    <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
      <h2 className="my-4 text-2xl font-bold text-center">Deudas</h2>

      <select
        id="player"
        defaultValue=""
        className="select select-bordered w-full mb-4"
        onChange={(e) => setPlayer(e.target.value)}
      >
        <option disabled value="">
          Elija un jugador
        </option>
        {players.map(({ id, name, surname }) => (
          <option value={id} key={id}>{`${surname}, ${name}`}</option>
        ))}
      </select>

      {debtSubjects.length > 0 && <SubjectsTable subjects={debtSubjects} />}
    </div>
  );
}