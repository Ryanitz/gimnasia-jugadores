/* eslint no-use-before-define: 0 */
import React, { useEffect, useState } from "react";
import {
  addPlayerToListRequest,
  getPlayersInListRequest,
  getPlayersListRequest,
  getPlayersRequest,
  removePlayerFromListRequest,
} from "../api/requests";
import Loading from "../components/loading";
import SectionTitle from "../components/sectionTitle";
import TrashIcon from "../components/trashIcon";

export default function PlayersList() {
  const [playerName, setPlayerName] = useState("");
  const [playerSurname, setPlayerSurname] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [list, setList] = useState({
    id: "",
    listName: "",
    players: [],
  });
  const [addedPlayers, setAddedPlayers] = useState([]);

  const LIST_ID = "0xfffd8d7273f9d118";

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    getPlayersList();
  };

  const getPlayersList = async () => {
    const playersListInfo = await getPlayersListRequest(LIST_ID);
    const playersInList = await getPlayersInListRequest(LIST_ID);
    setList({
      id: playersListInfo.id,
      listName: playersListInfo.listName,
      players: playersInList,
    });
    const newAddedPlayersList = localStorage.getItem("addedPlayers");
    if (newAddedPlayersList && JSON.parse(newAddedPlayersList))
      setAddedPlayers(JSON.parse(newAddedPlayersList));
    setIsLoading(false);
  };

  const isValidListId = async () => {
    if (window.location.pathname.includes(LIST_ID)) getPlayers();
    else window.location.replace("/");
  };

  const addPlayerToList = async () => {
    let player = null;
    if (
      selectedPlayerId &&
      players.find((aPlayer) => aPlayer.id === selectedPlayerId)
    )
      player = players.find((aPlayer) => aPlayer.id === selectedPlayerId);
    else if (playerName !== "" && playerSurname !== "")
      player = { name: playerName, surname: playerSurname };

    if (player) {
      setIsLoading(true);
      const newPlayerId = await addPlayerToListRequest(
        LIST_ID,
        player.name,
        player.surname
      );

      const newPlayerList = [{ ...player, id: newPlayerId }, ...list.players];
      setList({
        ...list,
        players: newPlayerList,
      });

      localStorage.setItem(
        "addedPlayers",
        JSON.stringify([newPlayerId, ...addedPlayers])
      );
      setAddedPlayers([...addedPlayers, newPlayerId]);
      setIsLoading(false);
    }
  };

  const removePlayerFromList = async (anIndex) => {
    setIsLoading(true);
    const newList = list.players.filter(
      (player) => player.id !== list.players[anIndex].id
    );

    const res = await removePlayerFromListRequest(
      list.players[anIndex].id,
      list.id
    );
    if (res === "Deleted") {
      const newAddedPlayersList = addedPlayers.filter(
        (aPlayerId) => aPlayerId !== list.players[anIndex].id
      );
      localStorage.setItem("addedPlayers", JSON.stringify(newAddedPlayersList));
      setAddedPlayers(newAddedPlayersList);

      setList({
        ...list,
        players: newList,
      });
    }
    setIsLoading(false);
  };

  const hasSameName = (aName, anotherName, aSurname, anotherSurname) => {
    return (
      aName.toLowerCase() === anotherName.toLowerCase() &&
      aSurname.toLowerCase() === anotherSurname.toLowerCase()
    );
  };

  const isInList = (anId, aName, aSurname) => {
    for (let i = 0; i < list.players.length; i++) {
      const player = list.players[i];
      if (
        anId === player.id ||
        hasSameName(aName, player.name, aSurname, player.surname)
      )
        return true;
    }
    return false;
  };

  useEffect(() => {
    setIsLoading(true);
    isValidListId();
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="w-full md:w-3/4 lg:w-1/2 transition-all px-4 pb-16 max-h-screen mx-auto flex flex-col">
        <SectionTitle title={"Lista de " + list.listName} />

        <select
          id="player"
          defaultValue=""
          className="select select-bordered w-full mb-4"
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          <option disabled value="">
            Jugadores
          </option>
          <option value={-1}>No estoy en lista</option>
          {players.map(({ id, name, surname }, index) => (
            <option
              value={id}
              key={index}
              className={!isInList(id, name, surname) ? "block" : "hidden"}
            >{`${name} ${surname}`}</option>
          ))}
        </select>

        <p className="font-bold mb-2">
          Si no estas en la lista anotate aca abajo
        </p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="input input-bordered col-span2 md:col-span-1 mb-4"
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido"
            className="input input-bordered col-span2 md:col-span-1 mb-4"
            onChange={(e) => setPlayerSurname(e.target.value)}
          />
        </div>

        <button className="btn mb-4" onClick={addPlayerToList}>
          Agregar a la lista
        </button>

        <h2 className="w-full my-4 text-2xl font-bold text-center">Anotados</h2>
        {list.players.length > 0 ? (
          <ol className="pl-4 list-decimal grid grid-cols-12 gap-4">
            {list.players.map(({ id, name, surname }, index) => (
              <div
                key={index}
                className="pl-8 p-4 shadow col-span-12 md:col-span-6 lg:col-span-4 flex items-center justify-between"
              >
                <li>{`${surname}, ${name}`}</li>
                {addedPlayers.includes(id) && (
                  <span onClick={() => removePlayerFromList(index)}>
                    <TrashIcon />
                  </span>
                )}
              </div>
            ))}
          </ol>
        ) : (
          <p className="w-full text-center">
            No hay jugadores anotados hasta el momento
          </p>
        )}
      </div>
    </div>
  );
}
