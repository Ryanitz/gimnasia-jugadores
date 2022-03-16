import { gql } from "@apollo/client";
import client from "../../apollo-client";

const GET_PLAYERS = gql`
  query Query {
    queryPlayer(order: { asc: surname, then: { asc: name } }) {
      id
      name
      surname
      payingType
    }
  }
`;
const GET_SUBJECTS = gql`
  query Query {
    querySubject(order: { asc: name }) {
      id
      name
      amount
      dueDate
      type
    }
  }
`;
const GET_EXPENSES = gql`
  query Query {
    queryExpense(order: { desc: date }) {
      id
      name
      totalPrice
      items {
        buyerName
        name
        price
        quantity
      }
      type
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
const REGISTER_EXPENSE = gql`
  mutation Mutation($input: [AddExpenseInput!]!) {
    addExpense(input: $input) {
      expense {
        id
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
  const players = response.data.queryPlayer.map(
    ({ id, name, surname, payingType }) => {
      return {
        id,
        name,
        surname,
        payingType,
      };
    }
  );

  return players;
};
export const getSubjectsRequest = async () => {
  const response = await client.query({
    query: GET_SUBJECTS,
  });
  const subjects = response.data.querySubject.map(
    ({ id, name, amount, type, dueDate }) => {
      return {
        id,
        name,
        amount,
        dueDate,
        type,
      };
    }
  );

  return subjects;
};
export const getPlayerPaymentsRequest = async (aPlayerId) => {
  const response = await client.query({
    query: gql`
      query Query {
        queryPayment(filter: { payer: { allofterms: "${aPlayerId}" } }, order: {desc: payingDate}) {
          id
          payer
          amount
          subject
          payingDate
          debt
        }
      }
    `,
  });
  const payments = response.data.queryPayment.map(
    ({ id, payer, amount, subject, payingDate, debt }) => {
      return {
        id,
        payer,
        amount,
        subject,
        payingDate,
        debt,
      };
    }
  );

  return payments;
};
export const getAllPaymentsRequest = async () => {
  const response = await client.query({
    query: gql`
      query Query {
        queryPayment(order: { desc: payingDate }) {
          id
          payer
          amount
          subject
          payingDate
          debt
        }
      }
    `,
  });

  const payments = response.data.queryPayment.map(
    ({ id, payer, amount, subject, payingDate, debt }) => {
      return {
        id,
        payer,
        amount,
        subject,
        payingDate,
        debt,
      };
    }
  );

  return payments;
};
export const getExpensesListRequest = async () => {
  const response = await client.query({
    query: GET_EXPENSES,
  });
  const expenses = response.data.queryExpense.map(
    ({ id, name, totalPrice, items, type }) => {
      return {
        id,
        name,
        totalPrice,
        items,
        type,
      };
    }
  );

  return expenses;
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
  aPayingAmount,
  aPayingDate,
  aPayingDebt
) => {
  await client.mutate({
    mutation: REGISTER_PAYMENT,
    variables: {
      input: {
        payer: aPlayerId,
        amount: aPayingAmount,
        subject: aSubject,
        payingDate: aPayingDate,
        debt: aPayingDebt,
      },
    },
  });
};
export const registerSubjectRequest = async (
  aSubjectName,
  aSubjectType,
  aSubjectAmount,
  aSubjectDueDate
) => {
  let input = {
    name: aSubjectName,
    type: aSubjectType,
  };
  if (aSubjectType === "cuota") input.dueDate = aSubjectDueDate;
  else input.amount = aSubjectAmount;

  await client.mutate({
    mutation: REGISTER_SUBJECT,
    variables: {
      input,
    },
  });

  return await getSubjectsRequest();
};
export const registerExpenseRequest = async (
  anExpenseName,
  anExpenseTotalPrice,
  anExpenseItemsList,
  anExpenseType
) => {
  await client.mutate({
    mutation: REGISTER_EXPENSE,
    variables: {
      input: {
        name: anExpenseName,
        totalPrice: anExpenseTotalPrice,
        items: anExpenseItemsList,
        type: anExpenseType,
        date: new Date(),
      },
    },
  });

  return getExpensesListRequest();
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

export const updatePlayerPayingTypeRequest = async (aPlayerId, aPayingType) => {
  await client.mutate({
    mutation: gql`
      mutation Mutation($id: [ID!], $payingType: Int!) {
        updatePlayer(
          input: { filter: { id: $id }, set: { payingType: $payingType } }
        ) {
          player {
            id
          }
        }
      }
    `,
    variables: {
      id: aPlayerId,
      payingType: aPayingType,
    },
  });
};
export const updatePaymentDebtRequest = async (
  aPlayerId,
  aPaymentId,
  aPayingDebt,
  aPayingAmount
) => {
  await client.mutate({
    mutation: gql`
      mutation Mutation($id: [ID!], $debt: Int!, $amount: Int!) {
        updatePayment(
          input: { filter: { id: $id }, set: { debt: $debt, amount: $amount } }
        ) {
          payment {
            id
          }
        }
      }
    `,
    variables: {
      id: aPaymentId,
      debt: aPayingDebt,
      amount: aPayingAmount,
    },
  });

  return getPlayerPaymentsRequest(aPlayerId);
};
