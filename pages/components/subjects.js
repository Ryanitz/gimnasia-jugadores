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
              <td onClick={() => removeSubject(id)} className="cursor-pointer">
                Borrar
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
