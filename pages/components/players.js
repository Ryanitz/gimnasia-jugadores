import React, { useState, useEffect } from "react";
import { getPlayersRequest, removePlayerRequest } from "../api/requests";
import TrashIcon from "./TrashIcon";

export default function Players({ setIsLoading }) {
  const [players, setPlayers] = useState([]);

  const removePlayer = async (aPlayerId) => {
    setIsLoading(true);
    setPlayers(await removePlayerRequest(aPlayerId));
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
    <div className="overflow-auto pb-16">
      <table className="table w-full">
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
                  <TrashIcon />
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
