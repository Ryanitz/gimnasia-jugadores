import React, { useState, useEffect } from "react";
import {
  getPlayerPaymentsRequest,
  getPlayersRequest,
  getSubjectsRequest,
} from "./api/requests";
import SectionTitle from "./components/sectionTitle";
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
    if (!localStorage.getItem("loggedGimnasia")) window.location.replace("/");
    else getPlayers();
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
    <div className="w-full md:w-3/4 lg:w-1/2 transition-all px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
      <SectionTitle title="Deudas" />

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

      {debtSubjects.length === 0 && (
        <h3 className="text-lg font-semibold">No tiene deudas</h3>
      )}
      {debtSubjects.length > 0 && (
        <h3 className="text-lg font-semibold">Asuntos no pagados</h3>
      )}
      {debtSubjects.length > 0 && <SubjectsTable subjects={debtSubjects} />}
    </div>
  );
}
