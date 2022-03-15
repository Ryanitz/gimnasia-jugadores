import React, { useState } from "react";

export default function Expenses({ setIsLoading }) {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDetails, setExpenseDetails] = useState("");

  const registerExpense = () => {
    console.log(expenseName);
    console.log(expenseAmount);
    console.log(expenseDetails);
  };

  return (
    <div className="flex flex-col px-4 w-full md:w-1/2 mx-auto">
      <input
        type="text"
        id="name"
        placeholder="Nombre del gasto"
        onChange={(e) => setExpenseName(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <input
        type="number"
        id="amount"
        placeholder="Dinero gastado"
        onChange={(e) => setExpenseAmount(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <textarea
        id="description"
        placeholder="Detalles de la compra"
        onChange={(e) => setExpenseDetails(e.target.value)}
        className="textarea textarea-bordered w-full mb-4"
        rows={4}
      />
      <button className="btn mb-4" onClick={registerExpense}>
        Agregar gasto
      </button>
    </div>
  );
}
