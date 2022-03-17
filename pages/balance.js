import React, { useState, useEffect } from "react";
import Loading from "./components/loading";
import { getAllPaymentsRequest, getExpensesListRequest } from "./api/requests";
import ExpensesList from "./components/expensesList";
import SectionTitle from "./components/sectionTitle";

export default function Balance() {
  const [isLoading, setIsLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [coutasIncome, setCoutasIncome] = useState(0);
  const [dinnersIncome, setDinnersIncome] = useState(0);
  const [coutasOutcome, setCoutasOutcome] = useState(0);
  const [dinnersOutcome, setDinnersOutcome] = useState(0);
  const [outcome, setOutcome] = useState(0);

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyOutcome, setMonthlyOutcome] = useState(0);
  const [monthlyCoutasIncome, setMonthlyCoutasIncome] = useState(0);
  const [monthlyDinnersIncome, setMonthlyDinnersIncome] = useState(0);
  const [monthlyCoutasOutcome, setMonthlyCoutasOutcome] = useState(0);
  const [monthlyDinnersOutcome, setMonthlyDinnersOutcome] = useState(0);

  const [paymentsList, setPaymentsList] = useState([]);
  const [expensesList, setExpenseList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(-1);
  const today = new Date();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const getExpensesList = async () => {
    setExpenseList(await getExpensesListRequest());
    setIsLoading(false);
  };

  const calculateBalance = async () => {
    const paymentsList = await getAllPaymentsRequest();
    setPaymentsList(paymentsList);

    let finalIncome = 0;
    let calculateCoutasIncome = 0;
    let calculateDinnersIncome = 0;
    const filteredPaymentsList = paymentsList.filter(
      (payment) => payment.subject !== "Excedente"
    );
    filteredPaymentsList.forEach(({ amount, subject }) => {
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

  const calculateOutcomeFromMonth = (anExpensesList) => {
    let finalOutcome = 0;
    let calculateMonthlyCoutasOutcome = 0;
    let calculateMonthlyDinnersOutcome = 0;
    const filteredExpensesList = anExpensesList.filter(
      (payment) => payment.subject !== "Excedente"
    );
    filteredExpensesList.forEach(({ totalPrice, type }) => {
      if (type.toLowerCase().includes("cuota"))
        calculateMonthlyCoutasOutcome += totalPrice;
      else calculateMonthlyDinnersOutcome += totalPrice;

      finalOutcome += totalPrice;
    });
    setMonthlyCoutasOutcome(calculateMonthlyCoutasOutcome);
    setMonthlyDinnersOutcome(calculateMonthlyDinnersOutcome);
    setMonthlyOutcome(finalOutcome);
  };
  const calculateIncomeFromMonth = (aPaymentsList) => {
    let finalIncome = 0;
    let calculateMonthlyCoutasIncome = 0;
    let calculateMonthlyDinnersIncome = 0;

    const filteredPaymentsList = aPaymentsList.filter(
      (payment) => payment.subject !== "Excedente"
    );
    filteredPaymentsList.forEach(({ amount, subject }) => {
      if (subject.toLowerCase().includes("cuota"))
        calculateMonthlyCoutasIncome += amount;
      else calculateMonthlyDinnersIncome += amount;

      finalIncome += amount;
    });
    setMonthlyCoutasIncome(calculateMonthlyCoutasIncome);
    setMonthlyDinnersIncome(calculateMonthlyDinnersIncome);
    setMonthlyIncome(finalIncome);
  };

  useEffect(() => {
    setIsLoading(true);
    calculateBalance();
  }, []);

  useEffect(() => {
    let calculateOutcome = 0;
    let calculateCoutasOutcome = 0;
    let calculateDinnersOutcome = 0;

    const filteredExpensesList = expensesList.filter(
      (payment) => payment.subject !== "Excedente"
    );
    filteredExpensesList.forEach(({ type, totalPrice }) => {
      if (type.toLowerCase().includes("cuota"))
        calculateCoutasOutcome += totalPrice;
      else calculateDinnersOutcome += totalPrice;

      calculateOutcome += totalPrice;
    });

    setCoutasOutcome(calculateCoutasOutcome);
    setDinnersOutcome(calculateDinnersOutcome);
    setOutcome(calculateOutcome);
  }, [expensesList]);

  useEffect(() => {
    const filteredExpensesList = expensesList.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === selectedMonth;
    });
    const filteredPaymentsList = paymentsList.filter((payment) => {
      const paymentDate = new Date(payment.payingDate);
      return paymentDate.getMonth() === selectedMonth;
    });

    calculateOutcomeFromMonth(filteredExpensesList);
    calculateIncomeFromMonth(filteredPaymentsList);
  }, [selectedMonth]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
        <SectionTitle title="Balance" />

        <table className="table table-compact w-full text-center">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ingreso</th>
              <th>Egreso</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover">
              <td>3T</td>
              <td>${coutasIncome}</td>
              <td>${coutasOutcome}</td>
              <td>${coutasIncome - coutasOutcome}</td>
            </tr>
            <tr className="hover">
              <td>Cenas</td>
              <td>${dinnersIncome}</td>
              <td>${dinnersOutcome}</td>
              <td>${dinnersIncome - dinnersOutcome}</td>
            </tr>
            <tr className="hover">
              <td>Total</td>
              <td>${income}</td>
              <td>${outcome}</td>
              <td>${income - outcome}</td>
            </tr>
          </tbody>
        </table>
        <hr className="my-4" />
        <div className="flex w-full justify-center items-center">
          <h2 className="text-2xl font-bold text-center">Balance de</h2>
          <select
            id="player"
            defaultValue={-1}
            className="select select-sm select-bordered ml-2"
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            <option disabled value={-1}>
              Elija un mes
            </option>
            {months.map((month, index) => (
              <option
                key={index}
                value={index}
                disabled={today.getMonth() < index}
              >
                {month}
              </option>
            ))}
          </select>
        </div>
        {selectedMonth !== -1 && (
          <table className="mt-4 table table-compact w-full text-center">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ingreso</th>
                <th>Egreso</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover">
                <td>3T</td>
                <td>${monthlyCoutasIncome}</td>
                <td>${monthlyCoutasOutcome}</td>
                <td>${monthlyCoutasIncome - monthlyCoutasOutcome}</td>
              </tr>
              <tr className="hover">
                <td>Cenas</td>
                <td>${monthlyDinnersIncome}</td>
                <td>${monthlyDinnersOutcome}</td>
                <td>${monthlyDinnersIncome - monthlyDinnersOutcome}</td>
              </tr>
              <tr className="hover">
                <td>Total</td>
                <td>${monthlyIncome}</td>
                <td>${monthlyOutcome}</td>
                <td>${monthlyIncome - monthlyOutcome}</td>
              </tr>
            </tbody>
          </table>
        )}
        <hr className="my-4" />
        <ExpensesList expensesList={expensesList} />
      </div>
    </div>
  );
}
