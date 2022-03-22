export default function SubjectsTable({
  subjects,
  removeSubject,
  hideSurplus,
}) {
  const convertDateToText = (aDate) => {
    const date = new Date(aDate);

    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-center">
        <thead>
          <tr>
            <th></th>
            <th>Asunto</th>
            <th>Monto ($)</th>
            <th>Vencimiento</th>
            {removeSubject && <th></th>}
          </tr>
        </thead>
        <tbody>
          {subjects &&
            subjects.map(({ name, type, amount, dueDate, id }, index) => {
              if (hideSurplus && name === "Excedente") return;
              return (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>{name}</td>
                  <td className="text-center">
                    {type === "normal" ? `$${amount}` : "---"}
                  </td>
                  <td className="text-center">
                    {type === "cuota" ? convertDateToText(dueDate) : "---"}
                  </td>
                  {removeSubject && (
                    <td
                      onClick={() => removeSubject(id)}
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
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
