import TrashIcon from "./TrashIcon";

export default function PlayerPayments({ playerPayments, removePayment }) {
  return (
    <div className="">
      <hr />
      <h2 className="text-xl font-bold text-center my-4">Pagos realizados</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Asunto</th>
            <th>Monto ($)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {playerPayments &&
            playerPayments.map(({ subject, amount, id }, index) => (
              <tr key={index} className="hover">
                <th>{index + 1}</th>
                <td>{subject}</td>
                <td>${amount}</td>
                <td
                  onClick={() => removePayment(id)}
                  className="cursor-pointer"
                >
                  <TrashIcon />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
