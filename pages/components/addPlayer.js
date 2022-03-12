import React, { useState } from "react";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { addPlayerRequest } from "../api/requests";

export default function AddPlayer({ switchToPlayersTab, setIsLoading }) {
  const [playerName, setPlayerName] = useState("");
  const [playerSurname, setPlayerSurname] = useState("");

  const ADD_PLAYER = gql`
    mutation Mutation($input: [AddPlayerInput!]!) {
      addPlayer(input: $input) {
        player {
          name
          surname
          id
        }
      }
    }
  `;

  const addPlayer = async () => {
    setIsLoading(true);
    await addPlayerRequest(playerName, playerSurname);

    switchToPlayersTab();
  };

  return (
    <div className="flex flex-col justify-center px-4 py-8 absolute w-screen md:w-1/2 top-0 bottom-0 left-0 right-0 m-auto z-10">
      <input
        type="text"
        placeholder="Nombre"
        className="input input-bordered w-full mb-4"
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Apellido"
        className="input input-bordered w-full mb-4"
        onChange={(e) => setPlayerSurname(e.target.value)}
      />
      <button className="btn" onClick={addPlayer}>
        Agregar Jugador
      </button>
    </div>
  );
}
