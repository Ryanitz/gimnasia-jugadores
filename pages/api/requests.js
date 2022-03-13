import { gql } from "@apollo/client";
import client from "../../apollo-client";

const GET_PLAYERS = gql`
  query Query {
    queryPlayer(order: { asc: surname, then: { asc: name } }) {
      id
      name
      surname
    }
  }
`;
const GET_SUBJECTS = gql`
  query Query {
    querySubject(order: { asc: name }) {
      id
      name
      amount
    }
  }
`;
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
const REGISTER_PAYMENT = gql`
  mutation Mutation($input: [AddPaymentInput!]!) {
    addPayment(input: $input) {
      payment {
        amount
        id
        payer
        subject
      }
    }
  }
`;
const REGISTER_SUBJECT = gql`
  mutation Mutation($input: [AddSubjectInput!]!) {
    addSubject(input: $input) {
      subject {
        id
        name
        amount
      }
    }
  }
`;
const REMOVE_PLAYER = gql`
  mutation Mutation($filter: PlayerFilter!) {
    deletePlayer(filter: $filter) {
      msg
    }
  }
`;
const REMOVE_PAYMENT = gql`
  mutation Mutation($filter: PaymentFilter!) {
    deletePayment(filter: $filter) {
      msg
    }
  }
`;
const REMOVE_SUBJECT = gql`
  mutation Mutation($filter: SubjectFilter!) {
    deleteSubject(filter: $filter) {
      msg
    }
  }
`;

export const getPlayersRequest = async () => {
  const response = await client.query({
    query: GET_PLAYERS,
  });
  const players = response.data.queryPlayer.map(({ id, name, surname }) => {
    return {
      id,
      name,
      surname,
    };
  });

  return players;
};
export const getSubjectsRequest = async () => {
  const response = await client.query({
    query: GET_SUBJECTS,
  });
  const subjects = response.data.querySubject.map(({ id, name, amount }) => {
    return {
      id,
      name,
      amount,
    };
  });

  return subjects;
};
export const getPlayerPaymentsRequest = async (aPlayerId) => {
  const response = await client.query({
    query: gql`
      query Query {
        queryPayment(filter: { payer: { allofterms: "${aPlayerId}" } }, order: {asc: payingDate}) {
          id
          payer
          amount
          subject
          payingDate
        }
      }
    `,
  });
  const payments = response.data.queryPayment.map(
    ({ id, payer, amount, subject, payingDate }) => {
      return {
        id,
        payer,
        amount,
        subject,
        payingDate,
      };
    }
  );

  return payments;
};

export const registerPlayerRequest = async (aPlayerName, aPlayerSurname) => {
  await client.mutate({
    mutation: ADD_PLAYER,
    variables: {
      input: {
        name: aPlayerName,
        surname: aPlayerSurname,
      },
    },
  });
};
export const registerPaymentRequest = async (
  aPlayerId,
  aSubject,
  aPayingAmount
) => {
  await client.mutate({
    mutation: REGISTER_PAYMENT,
    variables: {
      input: {
        payer: aPlayerId,
        amount: aPayingAmount,
        subject: aSubject,
        payingDate: new Date(),
      },
    },
  });
};
export const registerSubjectRequest = async (aSubjectName, aSubjectAmount) => {
  await client.mutate({
    mutation: REGISTER_SUBJECT,
    variables: {
      input: {
        name: aSubjectName,
        amount: aSubjectAmount,
      },
    },
  });

  return await getSubjectsRequest();
};

export const removePlayerRequest = async (aPlayerId) => {
  await client.mutate({
    mutation: REMOVE_PLAYER,
    variables: {
      filter: {
        id: aPlayerId,
      },
    },
  });

  return await getPlayersRequest();
};
export const removePaymentRequest = async (aPlayerId, aPaymentId) => {
  await client.mutate({
    mutation: REMOVE_PAYMENT,
    variables: {
      filter: {
        id: aPaymentId,
      },
    },
  });

  return await getPlayerPaymentsRequest(aPlayerId);
};
export const removeSubjectRequest = async (aSubjectId) => {
  await client.mutate({
    mutation: REMOVE_SUBJECT,
    variables: {
      filter: {
        id: aSubjectId,
      },
    },
  });

  return await getSubjectsRequest();
};
