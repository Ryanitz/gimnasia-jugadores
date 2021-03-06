export default function PlayerPayments({
  playerPayments,
  removePayment,
  payOffDebt,
  isAdmin,
}) {
  const convertDateToText = (aDate) => {
    const date = new Date(aDate);

    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };
  return (
    <div className="overflow-x-auto w-max-screem">
      <hr />
      <h2 className="text-xl font-bold text-center my-4">Pagos realizados</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Fecha</th>
            <th>Asunto</th>
            <th>Monto ($)</th>
            <th>Deuda ($)</th>
            {removePayment && <th></th>}
          </tr>
        </thead>
        <tbody>
          {playerPayments &&
            playerPayments.map(
              ({ subject, amount, id, payingDate, debt }, index) => (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>{convertDateToText(payingDate)}</td>
                  <td>{subject}</td>
                  <td>{amount === 0 ? "No asistió" : `$${amount}`}</td>
                  <td>
                    <span
                      className={debt > 0 ? "text-red-500 font-semibold" : ""}
                    >
                      {debt === 0 ? "---" : `$${debt}`}
                    </span>
                    {debt !== 0 && isAdmin && (
                      <button
                        className="ml-4 btn btn-sm"
                        disabled={debt === 0}
                        onClick={() => payOffDebt(id, amount + debt)}
                      >
                        Saldar deuda
                      </button>
                    )}
                  </td>
                  {removePayment && (
                    <td
                      onClick={() => removePayment(id)}
                      className="cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    </td>
                  )}
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}
