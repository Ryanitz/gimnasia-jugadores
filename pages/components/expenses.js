import React, { useState, useEffect } from "react";
import {
  getExpensesListRequest,
  getPlayersRequest,
  registerExpenseRequest,
  removeExpenseRequest,
} from "../api/requests";
import ExpenseItems from "./expenseItems";
import ExpensesList from "./expensesList";

export default function Expenses({ setIsLoading }) {
  const [expensesList, setExpensesList] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [expenseItems, setExpenseItems] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [players, setPlayers] = useState([]);

  const getExpensesList = async () => {
    setExpensesList(await getExpensesListRequest());
  };

  const getPlayers = async () => {
    setPlayers(await getPlayersRequest());
  };

  const registerExpense = async () => {
    if ((expenseName !== "", expenseItems.length > 0 && expenseType !== "")) {
      setIsLoading(true);
      setExpensesList(
        await registerExpenseRequest(
          expenseName,
          finalPrice,
          expenseItems,
          expenseType
        )
      );

      setExpenseName("");
      const expenseNameInput = document.getElementById("name");
      expenseNameInput.value = "";
      setExpenseItems([]);

      setIsLoading(false);
    }
  };

  const removeExpense = async (anExpenseId) => {
    setIsLoading(true);
    setExpensesList(await removeExpenseRequest(anExpenseId));
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
    <div className="flex flex-col w-full md:w-1/2 mx-auto pb-16">
      <div className="border rounded-lg p-4 bg-gray-100">
        <input
          type="text"
          id="name"
          placeholder="Nombre del gasto"
          onChange={(e) => setExpenseName(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <select
          id="type"
          defaultValue=""
          className="select select-bordered w-full mb-4"
          onChange={(e) => setExpenseType(e.target.value)}
        >
          <option disabled value="">
            Tipo de gasto
          </option>
          <option value="Couta">3T</option>
          <option value="Actvidad">Actividad</option>
        </select>
        <ExpenseItems
          players={players}
          expenseItems={expenseItems}
          setExpenseItems={setExpenseItems}
        />
        <h3 className="text-xl mb-4">Precio final: ${finalPrice}</h3>
        <button className="btn" onClick={registerExpense}>
          Registrar gasto
        </button>
      </div>
      <hr className="my-4" />
      <ExpensesList expensesList={expensesList} removeExpense={removeExpense} />
    </div>
  );
}
