import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checkLogin = () => {
    if (username.toLowerCase() === "gimnasia" && password === "Jugadores?") {
      setIsLogged(true);
      localStorage.setItem("loggedGimnasia", true);
    }
  };

  useEffect(() => {
    setIsLogged(!!localStorage.getItem("loggedGimnasia"));
  }, []);

  const loggedComponent = (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-4 bg-custom">
      <img src="/escudo.jpeg" className="mb-4" />
      <Link href="/jugadores">
        <a className="btn mb-4 w-full md:w-3/4 lg:w-1/2 transition-all">
          Jugadores
        </a>
      </Link>
      <Link href="/deudas">
        <a className="btn mb-4 w-full md:w-3/4 lg:w-1/2 transition-all">
          Deudas
        </a>
      </Link>
      <Link href="/balance">
        <a className="btn w-full mb-4 md:w-3/4 lg:w-1/2 transition-all">
          Balance
        </a>
      </Link>
      <Link href="/admin">
        <a className="btn w-full md:w-3/4 lg:w-1/2 transition-all">
          Administrador
        </a>
      </Link>
    </div>
  );
  const loginComponent = (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-4 bg-custom">
      <img src="/escudo.jpeg" className="mb-4" />
      <input
        type="text"
        placeholder="Ingrese usuario"
        className="input input-min-height input-bordered w-full md:w-3/4 lg:w-1/2 transition-all mb-4"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Ingrese contraseña"
        className="input input-min-height input-bordered w-full  md:w-3/4 lg:w-1/2 transition-all mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={checkLogin}
        className="btn w-full md:w-3/4 lg:w-1/2 transition-all"
      >
        Loguearse
      </button>
    </div>
  );
  return isLogged ? loggedComponent : loginComponent;
}
