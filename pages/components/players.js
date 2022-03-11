import { gql } from "@apollo/client";
import { useState, useEffect } from "react/cjs/react.development";
import client from "../../apollo-client";

export default function Players() {
  const [players, setPlayers] = useState([]);

  const getPlayers = async () => {
    const response = await client.query({
      query: gql`
        query Query {
          queryPlayer {
            id
            name
            surname
          }
        }
      `,
    });
    const players = response.data.queryPlayer.map(({ id, name, surname }) => {
      return {
        id,
        name,
        surname,
      };
    });

    console.log(players);

    setPlayers(players);
  };

  const REMOVE_PLAYER = gql`
    mutation Mutation($filter: PlayerFilter!) {
      deletePlayer(filter: $filter) {
        msg
      }
    }
  `;

  const removePlayer = async (aPlayerId) => {
    const response = await client.mutate({
      mutation: REMOVE_PLAYER,
      variables: {
        filter: {
          id: aPlayerId,
        },
      },
    });

    console.log(response);

    getPlayers();
  };

  useEffect(() => {
    console.log("TEST");
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
