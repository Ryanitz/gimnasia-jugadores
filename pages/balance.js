import React, { useState, useEffect } from "react";
import Loading from "./components/loading";
import {
  getAllPaymentsRequest,
  getExpensesBalanceByDatesRequest,
  getExpensesBalanceBySubjectRequest,
  getExpensesListRequest,
  getPaymentsBalanceByDatesRequest,
  getPaymentsBalanceBySubjectRequest,
} from "./api/requests";
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

  const calculateBalance = async () => {
    const calculateCuotasIncome = await getPaymentsBalanceBySubjectRequest(
      "cuota"
    );
    const calculateDinnerIncome = await getPaymentsBalanceBySubjectRequest(
      "actividad"
    );
    setCoutasIncome(calculateCuotasIncome);
    setDinnersIncome(calculateDinnerIncome);
    setIncome(calculateCuotasIncome + calculateDinnerIncome);

    const calculateCuotasOutcome = await getExpensesBalanceBySubjectRequest(
      "cuota"
    );
    const calculateDinnerOutcome = await getExpensesBalanceBySubjectRequest(
      "actividad"
    );
    setCoutasOutcome(calculateCuotasOutcome);
    setDinnersOutcome(calculateDinnerOutcome);
    setOutcome(calculateCuotasOutcome + calculateDinnerOutcome);

    setExpenseList(await getExpensesListRequest());

    setIsLoading(false);
  };

  const calculateOutcomeFromMonth = async (aMinDate, aMaxDate) => {
    setMonthlyCoutasOutcome(
      await getExpensesBalanceByDatesRequest("cuota", aMinDate, aMaxDate)
    );
    setMonthlyDinnersOutcome(
      await getExpensesBalanceByDatesRequest("actividad", aMinDate, aMaxDate)
    );
  };
  const calculateIncomeFromMonth = async (aMinDate, aMaxDate) => {
    setMonthlyCoutasIncome(
      await getPaymentsBalanceByDatesRequest("cuota", aMinDate, aMaxDate)
    );
    setMonthlyDinnersIncome(
      await getPaymentsBalanceByDatesRequest("actividad", aMinDate, aMaxDate)
    );
  };

  useEffect(() => {
    setIsLoading(true);
    calculateBalance();
  }, []);

  useEffect(() => {
    const date = new Date();
    console.log(selectedMonth);
    date.setMonth(selectedMonth + 1);
    date.setDate(0);
    const minDate = `${date.getFullYear()}-${
      (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1)
    }-01`;
    const maxDate = `${date.getFullYear()}-${
      (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1)
    }-${(date.getDate() < 10 ? "0" : "") + date.getDate()}`;
    console.log(minDate);
    console.log(maxDate);

    calculateOutcomeFromMonth(minDate, maxDate);
    calculateIncomeFromMonth(minDate, maxDate);
  }, [selectedMonth]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="w-full md:w-3/4 lg:w-1/2 transition-all px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
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
              <td>Actividades</td>
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
                <td>Actividades</td>
                <td>${monthlyDinnersIncome}</td>
                <td>${monthlyDinnersOutcome}</td>
                <td>${monthlyDinnersIncome - monthlyDinnersOutcome}</td>
              </tr>
              <tr className="hover">
                <td>Total</td>
                <td>${monthlyCoutasIncome + monthlyDinnersIncome}</td>
                <td>${monthlyCoutasOutcome + monthlyDinnersOutcome}</td>
                <td>
                  $
                  {monthlyCoutasIncome +
                    monthlyDinnersIncome -
                    (monthlyCoutasOutcome + monthlyDinnersOutcome)}
                </td>
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
