import React, { useState, useEffect } from "react";
import {
  getSubjectsRequest,
  registerSubjectRequest,
  removeSubjectRequest,
} from "../api/requests";

export default function Subjects({ setIsLoading }) {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectAmount, setSubjectAmount] = useState("");
  const [isFee, setIsFee] = useState(true);
  const [date, setDate] = useState("");

  const getSubjects = async () => {
    setSubjects(await getSubjectsRequest());
    setIsLoading(false);
  };
  const registerSubject = async () => {
    if (
      subjectName !== "" &&
      ((subjectAmount !== "" && !isFee) ||
        (isFee && date !== "" && !isNaN(date)))
    ) {
      setIsLoading(true);
      setSubjects(
        await registerSubjectRequest(
          subjectName,
          isFee ? "cuota" : "normal",
          parseInt(subjectAmount),
          date
        )
      );
      setIsLoading(false);
    }
  };
  const removeSubject = async (aSubjectId) => {
    setIsLoading(true);
    setSubjects(await removeSubjectRequest(aSubjectId));
    setIsLoading(false);
  };

  const setCustomDate = (aDate) => {
    const dateSplit = aDate.split("-");
    setDate(
      new Date(
        parseInt(dateSplit[0]),
        parseInt(dateSplit[1]) - 1,
        parseInt(dateSplit[2])
      )
    );
  };

  const convertDateToText = (aDate) => {
    const date = new Date(aDate);

    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getSubjects();
  }, []);

  return (
    <div className="w-full md:w-1/2 px-4 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
      <input
        type="text"
        id="subject"
        placeholder="Nombre del ausnto"
        onChange={(e) => setSubjectName(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <label className="label cursor-pointer flex justify-start mb-4">
        <input
          type="checkbox"
          onClick={(e) => setIsFee(e.target.checked)}
          defaultChecked={isFee}
          className="checkbox"
        />
        <span className="ml-4">El asunto es cuota</span>
      </label>

      {isFee ? (
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Se puede pagar hasta</label>
          <input
            id="date"
            type="date"
            placeholder="Ingrese monto"
            className="input input-min-height input-bordered w-full mb-4 font-semibold appearance-none text-left"
            onChange={(e) => setCustomDate(e.target.value)}
          />
        </div>
      ) : (
        <input
          type="number"
          id="amount"
          placeholder="Monto predeterminado"
          onChange={(e) => setSubjectAmount(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
      )}

      <button className="btn mb-4" onClick={registerSubject}>
        Agregar asunto
      </button>

      {subjects.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Asunto</th>
                <th>Monto ($)</th>
                <th>Vencimiento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(({ name, type, amount, dueDate, id }, index) => (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>{name}</td>
                  <td className="text-center">
                    {type === "normal" ? `$${amount}` : "---"}
                  </td>
                  <td className="text-center">
                    {type === "cuota" ? convertDateToText(dueDate) : "---"}
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
