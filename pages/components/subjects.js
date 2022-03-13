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

  const getSubjects = async () => {
    setSubjects(await getSubjectsRequest());
    setIsLoading(false);
  };

  const registerSubject = async () => {
    if (subjectName !== "" && subjectAmount !== "") {
      setIsLoading(true);
      setSubjects(
        await registerSubjectRequest(subjectName, parseInt(subjectAmount))
      );
      setIsLoading(false);
      resetValues();
    }
  };

  const removeSubject = async (aSubjectId) => {
    setIsLoading(true);
    setSubjects(await removeSubjectRequest(aSubjectId));
    setIsLoading(false);
  };

  const resetValues = () => {
    const subjectInput = document.getElementById("subject");
    const amountInput = document.getElementById("amount");
    subjectInput.value = "";
    amountInput.value = "";
    setSubjectName("");
    setSubjectAmount("");
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
      <input
        type="number"
        id="amount"
        placeholder="Monto predeterminado"
        onChange={(e) => setSubjectAmount(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <button className="btn mb-4" onClick={registerSubject}>
        Agregar asunto
      </button>

      {subjects.length > 0 && (
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
            {subjects.map(({ name, amount, id }, index) => (
              <tr key={index} className="hover">
                <th>{index + 1}</th>
                <td>{name}</td>
                <td>${amount}</td>
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
      )}
    </div>
  );
}
