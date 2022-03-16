import ExpenseItemsTable from "./expenseItemsTable";

export default function ExpenseItems({
  players,
  expenseItems,
  setExpenseItems,
}) {
  const addItem = () => {
    const itemNameInput = document.getElementById("item-name");
    const itemPriceInput = document.getElementById("item-price");
    const itemAmountInput = document.getElementById("item-amount");
    const itemBuyerInput = document.getElementById("item-buyer");
    const buyerIndex = itemBuyerInput.value;

    if (
      itemNameInput.value !== "" &&
      itemPriceInput.value !== "" &&
      buyerIndex !== -1
    ) {
      const newExpenseItem = {
        name: itemNameInput.value,
        price: parseInt(itemPriceInput.value),
        quantity: parseInt(itemAmountInput.value),
        buyerName: `${players[buyerIndex].surname}, ${players[buyerIndex].name}`,
        buyerId: players[buyerIndex].id,
      };

      setExpenseItems([...expenseItems, newExpenseItem]);

      itemNameInput.value = "";
      itemPriceInput.value = "";
      itemAmountInput.value = "";
      itemBuyerInput.value = -1;
    }
  };

  return (
    <div className="border rounded-lg flex flex-col p-4 mb-4">
      <h3 className="font-semibold text-xl mb-4">Items de la compra</h3>
      {expenseItems && expenseItems.length > 0 && (
        <ExpenseItemsTable expenseItems={expenseItems} />
      )}
      {expenseItems && expenseItems.length > 0 && <hr className="mb-4" />}
      {expenseItems && expenseItems.length > 0 && (
        <h3 className="font-semibold text-lg mb-2">Nuevo item</h3>
      )}
      <div className="flex flex-col">
        <label className="text-sm mb-1 font-semibold">Nombre del item</label>
        <input
          type="text"
          id="item-name"
          placeholder="Nombre del item"
          className="input input-bordered w-full mb-4"
        />
      </div>
      <div className="flex">
        <div className="flex flex-col w-1/2 mr-2">
          <label className="text-sm mb-1 font-semibold">Precio final ($)</label>
          <input
            type="number"
            id="item-price"
            placeholder="Precio final ($)"
            className="input input-bordered w-full mb-4"
          />
        </div>
        <div className="flex flex-col w-1/2 ml-2">
          <label className="text-sm mb-1 font-semibold">Cantidad</label>
          <input
            type="number"
            id="item-amount"
            placeholder="Cantidad"
            className="input input-bordered w-full mb-4"
          />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label className="text-sm mb-1 font-semibold">Comprador</label>
        <select
          id="item-buyer"
          defaultValue={-1}
          className="select select-bordered w-full mb-4"
        >
          <option disabled value={-1}>
            Seleccione al comprador
          </option>
          {players &&
            players.map(({ id, name, surname }, index) => (
              <option value={index} key={id}>{`${surname}, ${name}`}</option>
            ))}
        </select>
      </div>
      <button className="btn mb-4" onClick={addItem}>
        Agregar item
      </button>
    </div>
  );
}
