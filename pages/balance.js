import React, { useState, useEffect } from "react";
import Loading from "./components/loading";
import { getAllPaymentsRequest, getExpensesListRequest } from "./api/requests";
import ExpensesList from "./components/expensesList";

export default function Balance() {
  const [isLoading, setIsLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [coutasIncome, setCoutasIncome] = useState(0);
  const [dinnersIncome, setDinnersIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [payments, setPayments] = useState([]);
  const [expensesList, setExpenseList] = useState([]);

  const getExpensesList = async () => {
    setExpenseList(await getExpensesListRequest());
    setIsLoading(false);
  };

  const calculateBalance = async () => {
    const paymentsList = await getAllPaymentsRequest();
    setPayments(paymentsList);

    let finalIncome = 0;
    let calculateCoutasIncome = 0;
    let calculateDinnersIncome = 0;
    paymentsList.forEach(({ amount, subject }) => {
      if (subject.toLowerCase().includes("cuota"))
        calculateCoutasIncome += amount;
      else calculateDinnersIncome += amount;

      finalIncome += amount;
    });
    setCoutasIncome(calculateCoutasIncome);
    setDinnersIncome(calculateDinnersIncome);
    setIncome(finalIncome);

    getExpensesList();
  };

  useEffect(() => {
    setIsLoading(true);
    calculateBalance();
  }, []);

  useEffect(() => {
    let calculateOutcome = 0;
    expensesList.forEach(({ totalPrice }) => {
      calculateOutcome += totalPrice;
    });

    setOutcome(calculateOutcome);
  }, [expensesList]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
        <h2 className="my-4 text-2xl font-bold text-center">Balance</h2>
        <p>Ingresos por 3T: {coutasIncome}</p>
        <p>Ingresos por cenas: {dinnersIncome}</p>
        <p>Dinero total: {income}</p>
        <p>Dinero gastado: {outcome}</p>
        <p>Balance total: {income - outcome}</p>
        <hr className="my-4" />
        <ExpensesList expensesList={expensesList} />
      </div>
    </div>
  );
}
