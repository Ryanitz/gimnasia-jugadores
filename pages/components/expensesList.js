import React, { useState } from "react";
import ExpenseItemsTable from "./expenseItemsTable";

export default function ExpensesList({ expensesList }) {
  const [expandItems, setExpandItems] = useState(-1);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Lista de gastos</h2>
      {expensesList &&
        expensesList.map(({ name, totalPrice, items }, index) => (
          <div key={index} className="border rounded-lg p-2">
            <div className="flex items-center mb-2">
              <span className="mr-2 text-sm font-semibold">{index + 1}</span>
              <p className="w-full">
                <span className="font-semibold truncate">Nombre:</span> {name}
              </p>
              <p className="w-full">
                <span className="font-semibold truncate">Precio final:</span> $
                {totalPrice}
              </p>
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
