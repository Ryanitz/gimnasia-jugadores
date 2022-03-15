import React, { useState, useEffect } from "react";
import Loading from "./components/loading";
import { getAllPaymentsRequest } from "./api/requests";

export default function Balance() {
  const [isLoading, setIsLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [payments, setPayments] = useState([]);

  const calculateBalance = async () => {
    const paymentsList = await getAllPaymentsRequest();
    setPayments(paymentsList);

    let finalIncome = 0;
    paymentsList.forEach(({ amount }) => {
      finalIncome += amount;
    });
    setIncome(finalIncome);

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    calculateBalance();
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
        <h2 className="my-4 text-2xl font-bold text-center">Balance</h2>
        <p>Dinero ingresado: {income}</p>
        <p>Dinero gastado: {outcome}</p>
        <p>Balance total: {income - outcome}</p>
        <hr className="mt-4" />
        <h2 className="my-4 text-xl font-bold text-center">Lista de gastos</h2>
        {payments.map(({ id, payer, amount, subject, payingDate, debt }) => (
          <p>
            El jugador {payer} pago ${amount} el dia {payingDate} {subject}
          </p>
        ))}
      </div>
    </div>
  );
}
