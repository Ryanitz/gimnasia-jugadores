import React, { useState, useEffect } from "react";
import {
  getSubjectsRequest,
  registerSubjectRequest,
  removeSubjectRequest,
} from "../api/requests";
import SubjectsTable from "./subjectsTable";

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
          parseFloat(subjectAmount),
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

  useEffect(() => {
    setIsLoading(true);
    getSubjects();
  }, []);

  return (
    <div className="w-full md:w-1/2 pb-16 max-h-screen mx-auto flex flex-col overflow-y-auto">
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
        <SubjectsTable subjects={subjects} removeSubject={removeSubject} />
      )}
    </div>
  );
}
