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
      payingType
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
      date
      type
    }
  }
`;
const GET_PAYMENTS_BALANCE = gql`
  query Query {
    aggregatePayment(
      filter: { not: { subject: { allofterms: "Excedente" } } }
    ) {
      amountSum
    }
  }
`;
const GET_EXPENSES_BALANCE = gql`
  query Query {
    aggregateExpense {
      totalPriceSum
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
        id
        subject
        subjectType
        payingDate
        payer
        debt
        amount
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
const REMOVE_EXPENSE = gql`
  mutation Mutation($filter: ExpenseFilter!) {
    deleteExpense(filter: $filter) {
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
    ({ id, name, amount, type, payingType, dueDate }) => {
      return {
        id,
        name,
        amount,
        dueDate,
        type,
        payingType,
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
          subjectType
          payingDate
          debt
        }
      }
    `,
  });

  const payments = response.data.queryPayment.map(
    ({ id, payer, amount, subject, subjectType, payingDate, debt }) => {
      return {
        id,
        payer,
        amount,
        subject,
        subjectType,
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
    ({ id, name, totalPrice, items, type, date }) => {
      return {
        id,
        name,
        totalPrice,
        items,
        type,
        date,
      };
    }
  );

  return expenses;
};
export const getPaymentsBalanceBySubjectRequest = async (aSubjectKeyWord) => {
  const response = await client.query({
    query: gql`
      query MyQuery {
        aggregatePayment(filter: { subjectType: { anyofterms: "${aSubjectKeyWord}" } }) {
          amountSum
        }
      }
    `,
  });

  return response.data.aggregatePayment.amountSum;
};
export const hasPlayerPaidSubject = async (playerId, subjectName) => {
  const response = await client.query({
    query: gql`
      query MyQuery {
        queryPayment(
          filter: {
            payer: { allofterms: "${playerId}" }
            subject: { allofterms: "${subjectName}" }
          }
        ) {
          id
        }
      }
    `,
  });

  return response.data.queryPayment.length > 0;
};
export const getExpensesBalanceBySubjectRequest = async (aSubjectKeyWord) => {
  const response = await client.query({
    query: gql`
      query Query {
        aggregateExpense(filter: { type: { allofterms: "${aSubjectKeyWord}" } }) {
          totalPriceSum
        }
      }
    `,
  });

  return response.data.aggregateExpense.totalPriceSum;
};
export const getPaymentsBalanceByDatesRequest = async (
  aSubjectKeyWord,
  aMinDate,
  aMaxDate
) => {
  const response = await client.query({
    query: gql`
      query MyQuery {
        aggregatePayment(
          filter: {
            payingDate: {
              between: {
                min: "${aMinDate}T00:00:00.247Z"
                max: "${aMaxDate}T23:59:59.247Z"
              }
            }
            subjectType: { allofterms: "${aSubjectKeyWord}" }
          }
        ) {
          amountSum
        }
      }
    `,
  });

  return response.data.aggregatePayment.amountSum;
};
export const getExpensesBalanceByDatesRequest = async (
  aSubjectKeyWord,
  aMinDate,
  aMaxDate
) => {
  const response = await client.query({
    query: gql`
      query MyQuery {
        aggregateExpense(
          filter: {
            date: {
              between: {
                min: "${aMinDate}T00:00:00.247Z"
                max: "${aMaxDate}T23:59:59.247Z"
              }
            }
            type: { allofterms: "${aSubjectKeyWord}" }
          }
        ) {
          totalPriceSum
        }
      }
    `,
  });

  return response.data.aggregateExpense.totalPriceSum;
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
  aSubjectType,
  aPayingAmount,
  aPayingDate,
  aPayingDebt
) => {
  const response = await client.mutate({
    mutation: REGISTER_PAYMENT,
    variables: {
      input: {
        payer: aPlayerId,
        amount: aPayingAmount,
        subject: aSubject,
        subjectType: aSubjectType,
        payingDate: aPayingDate,
        debt: aPayingDebt,
      },
    },
  });

  return response.data.addPayment.payment[0];
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

  return aPlayerId;
};
export const removePaymentRequest = async (aPlayerId, aPaymentId) => {
  const response = await client.mutate({
    mutation: REMOVE_PAYMENT,
    variables: {
      filter: {
        id: aPaymentId,
      },
    },
  });

  return true;
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
export const removeExpenseRequest = async (anExpenseId) => {
  await client.mutate({
    mutation: REMOVE_EXPENSE,
    variables: {
      filter: {
        id: anExpenseId,
      },
    },
  });

  return getExpensesListRequest();
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
      mutation Mutation($id: [ID!], $debt: Float!, $amount: Float!) {
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
