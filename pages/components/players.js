import React, { useState, useEffect } from "react";
import { getPlayersRequest, removePlayerRequest } from "../api/requests";

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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ name, surname, id }, index) => (
            <tr key={index} className="hover">
              <th>{index + 1}</th>
              <td>{name}</td>
              <td>{surname}</td>
              <td onClick={() => removePlayer(id)} className="cursor-pointer">
                Borrar
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
