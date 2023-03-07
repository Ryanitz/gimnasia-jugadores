import React, { useState, useEffect } from "react";
import { getPlayersRequest, removePlayerRequest } from "../api/requests";

export default function Players({ setIsLoading }) {
  const [players, setPlayers] = useState([]);

  const removePlayer = async (aPlayerId) => {
    setIsLoading(true);
    const playerIdRemoved = await removePlayerRequest(aPlayerId);
    setPlayers(players.filter((aPlayer) => playerIdRemoved !== aPlayer.id));
    setIsLoading(false);
  };

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getPlayers();
  }, []);

  return (
    <div className="overflow-auto pb-16 flex justify-center">
      <table className="table w-full md:w-3/4 lg:w-1/2 transition-all">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Apellido</th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ name, surname, id }, index) => (
            <tr key={index} className="hover">
              <th className="flex">
                {index + 1}
                <span
                  onClick={() => removePlayer(id)}
                  className="ml-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </span>
              </th>
              <td>{name}</td>
              <td>{surname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
