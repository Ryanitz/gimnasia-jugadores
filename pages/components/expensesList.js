import React, { useState } from "react";
import ExpenseItemsTable from "./expenseItemsTable";

export default function ExpensesList({ expensesList, removeExpense }) {
  const [expandItems, setExpandItems] = useState(-1);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Lista de gastos</h2>
      {expensesList &&
        expensesList.map(({ id, name, totalPrice, items }, index) => (
          <div key={index} className="border rounded-lg p-2 mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-2 text-sm font-semibold">{index + 1}</span>
              <p className="w-full">
                <span className="font-semibold truncate">Nombre:</span> {name}
              </p>
              <p className="w-full">
                <span className="font-semibold truncate">Precio final:</span> $
                {totalPrice}
              </p>
              <div onClick={() => removeExpense(id)} className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>
            <p
              className="text-center cursor-pointer font-semibold mb-2"
              onClick={() => setExpandItems(expandItems === index ? -1 : index)}
            >
              {expandItems === index ? "Ocultar items" : "Ver items"}
            </p>
            {expandItems === index && (
              <ExpenseItemsTable expenseItems={items} />
            )}
          </div>
        ))}
    </div>
  );
}
