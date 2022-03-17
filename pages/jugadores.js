import React, { useState, useEffect } from "react";
import { getPlayerPaymentsRequest, getPlayersRequest } from "./api/requests";
import PlayerPayments from "./components/playerPayments";
import SectionTitle from "./components/sectionTitle";

export default function PlayersList() {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [payer, setPayer] = useState("");
  const [playerPayments, setPlayerPayments] = useState([]);

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    setIsLoading(false);
  };

  const getPlayerPayments = async () => {
    setPlayerPayments(await getPlayerPaymentsRequest(payer));

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
    <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
      <SectionTitle title="Jugadores" />

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
