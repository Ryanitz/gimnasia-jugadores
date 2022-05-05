/* eslint no-use-before-define: 0 */
import React, { useState, useEffect } from 'react';
import {
  getPlayersRequest,
  getSubjectsRequest,
  hasPlayerPaidSubject,
} from './api/requests';
import SectionTitle from './components/sectionTitle';
import Loading from './components/loading';

export default function Deudores() {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [playersDebtList, setPlayersDebtList] = useState([]);
  const [playersDebtListFiltered, setPlayersDebtListFiltered] = useState([]);
  const [filteredSubject, setFilteredSubject] = useState('');

  const feeValues = [0, 1700, 2700, 4000, 6000, 12000];

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
    getSubjects();
  };

  const getSubjects = async () => {
    setSubjects(await getSubjectsRequest());
    setIsLoading(false);
  };

  const loadDebtsList = async () => {
    setIsLoading(true);
    const subjectsNotPaidByPlayers = [];
    const playersFilter = players.slice(0, 30);
    let i = 0;
    for (const player of players) {
      for (const subject of subjects) {
        if (
          (subject.name.toLowerCase().includes('cena') ||
            subject.name.toLowerCase().includes('cuota') ||
            subject.type.toLowerCase().includes('actividad')) &&
          subject.id === filteredSubject
        ) {
          const hasPaidSubject = await hasPlayerPaidSubject(
            player.id,
            subject.name
          );
          if (!hasPaidSubject)
            subjectsNotPaidByPlayers.push({ player, subject });
        }
      }
      console.log(subjectsNotPaidByPlayers);
    }
    setPlayersDebtList(subjectsNotPaidByPlayers);
    setPlayersDebtListFiltered(
      await subjectsNotPaidByPlayers.filter(
        ({ player, subject }) =>
          subject.id === filteredSubject || filteredSubject === ''
      )
    );
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    if (!localStorage.getItem('loggedGimnasiaAdmin'))
      window.location.replace('/');
    else getPlayers();
  }, []);

  useEffect(() => {
    const update = async () => {
      setPlayersDebtListFiltered(
        await playersDebtList.filter(
          ({ player, subject }) =>
            subject.id === filteredSubject || filteredSubject === ''
        )
      );
    };
    update();
  }, [filteredSubject]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="w-full md:w-3/4 lg:w-1/2 transition-all px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
        <SectionTitle title="Lista de Deudores" />

        <button className="btn mb-4" onClick={loadDebtsList}>
          Cargar lista de deudores
        </button>

        <select
          id="player"
          defaultValue=""
          className="select select-bordered w-full mb-4"
          onChange={(e) => setFilteredSubject(e.target.value)}
        >
          <option disabled value="">
            Filtrar por asunto
          </option>
          {subjects.map(({ id, name, type }) => {
            if (
              name.toLowerCase().includes('cena') ||
              name.toLowerCase().includes('cuota') ||
              type.toLowerCase().includes('actividad')
            )
              return <option value={id} key={id}>{`${name}`}</option>;
          })}
        </select>

        {playersDebtListFiltered.length > 0 && (
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Asunto</th>
                <th>Deuda</th>
              </tr>
            </thead>
            <tbody>
              {playersDebtListFiltered.map(({ player, subject }, index) => (
                <tr key={index} className="hover">
                  <td>
                    {player.surname}, {player.name}
                  </td>
                  <td>{subject.name}</td>
                  <td className="text-red-500 font-bold">
                    $
                    {subject.type === 'cuota'
                      ? feeValues[player.payingType] || ' a definir'
                      : subject.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
