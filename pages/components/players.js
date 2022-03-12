import React, { useState, useEffect } from "react";
import { getPlayersRequest, removePlayerRequest } from "../api/requests";

export default function Players() {
  const [players, setPlayers] = useState([]);

  const removePlayer = async (aPlayerId) => {
    setPlayers(await removePlayerRequest(aPlayerId));
  };

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div className="overflow-x-auto">
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
