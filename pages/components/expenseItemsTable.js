export default function ExpenseItemsTable({ expenseItems }) {
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
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
