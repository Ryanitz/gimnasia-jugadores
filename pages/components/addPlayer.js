import React, { useState } from "react";
import { registerPlayerRequest } from "../api/requests";

export default function AddPlayer({ switchToPlayersTab, setIsLoading }) {
  const [playerName, setPlayerName] = useState("");
  const [playerSurname, setPlayerSurname] = useState("");

  const addPlayer = async () => {
    if (playerName !== "" && playerSurname !== "") {
      setIsLoading(true);
      await registerPlayerRequest(
        playerName.toUpperCase(),
        playerSurname.toUpperCase()
      );

      switchToPlayersTab();
    }
  };

  const uploadFile = () => {
    const fileInput = document.getElementById("upload-file");
    fileInput.click();
  };

  const loadPlayersList = async (event) => {
    if (event.target.files && event.target.files[0]) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const players = event.target.result.split("\n");

        await players.forEach(async (player) => {
          const playerSplit = player.split(", ");

          await registerPlayerRequest(playerSplit[1], playerSplit[0]);
        });
      };
      await reader.readAsText(event.target.files[0]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center px-4 pb-16 w-screen max-h-screen overflow-y-auto md:w-1/2 m-auto z-10">
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
      <button className="btn mb-4" onClick={addPlayer}>
        Agregar Jugador
      </button>
      <hr />
      <button className="btn mt-4" onClick={uploadFile}>
        Cargar lista
      </button>
      <input
        type="file"
        id="upload-file"
        className="hidden"
        accept=".txt"
        onChange={loadPlayersList}
        placeholder="Cargar lista"
      />
    </div>
  );
}
