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
    <div className="flex flex-col justify-center pb-16 md:w-3/4 lg:w-1/2 transition-all m-auto z-10">
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
      <hr className="hidden mt-4" />
      <button className="hidden btn mt-4" onClick={uploadFile}>
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
