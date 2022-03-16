import React, { useState, useEffect } from "react";
import {
  getExpensesListRequest,
  getPlayersRequest,
  registerExpenseRequest,
} from "../api/requests";
import ExpenseItems from "./expenseItems";
import ExpensesList from "./expensesList";

export default function Expenses({ setIsLoading }) {
  const [expensesList, setExpenseList] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseItems, setExpenseItems] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [players, setPlayers] = useState([]);

  const getExpensesList = async () => {
    setExpenseList(await getExpensesListRequest());
  };

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
  };

  const registerExpense = async () => {
    setIsLoading(true);
    setExpenseList(
      await registerExpenseRequest(expenseName, finalPrice, expenseItems)
    );

    setExpenseName("");
    const expenseNameInput = document.getElementById("name");
    expenseNameInput.value = "";
    setExpenseItems([]);

    setIsLoading(false);
  };

  useEffect(() => {
    getPlayers();
    getExpensesList();
  }, []);

  useEffect(() => {
    let calculatePrice = 0;
    expenseItems.forEach(({ price }) => (calculatePrice += price));
    setFinalPrice(calculatePrice);
  }, [expenseItems]);

  return (
    <div className="flex flex-col px-4 w-full md:w-1/2 mx-auto pb-16">
      <input
        type="text"
        id="name"
        placeholder="Nombre del gasto"
        onChange={(e) => setExpenseName(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <ExpenseItems
        players={players}
        expenseItems={expenseItems}
        setExpenseItems={setExpenseItems}
      />
      <h3 className="text-xl mb-4">Precio final: ${finalPrice}</h3>
      <button className="btn mb-4" onClick={registerExpense}>
        Registrar gasto
      </button>
      <hr className="mb-4" />
      <ExpensesList expensesList={expensesList} />
    </div>
  );
}
