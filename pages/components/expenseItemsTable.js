export default function ExpenseItemsTable({ expenseItems, removeItem }) {
  return (
    <div className="overflow-auto w-full max-h-48">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Precio x unidad</th>
            <th>Comprador</th>
            {removeItem && <th></th>}
          </tr>
        </thead>
        <tbody>
          {expenseItems &&
            expenseItems.map(({ name, buyerName, price, quantity }, index) => (
              <tr key={index} className="hover">
                <th className="flex">{index + 1}</th>
                <td>{name}</td>
                <td>${price}</td>
                <td>{quantity ? quantity : "---"}</td>
                <td>
                  {quantity ? `$${(price / quantity).toFixed(2)}` : "---"}
                </td>
                <td>{buyerName}</td>
                {removeItem && (
                  <td>
                    <div
                      onClick={() => removeItem(index)}
                      className="cursor-pointer"
                    >
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
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
