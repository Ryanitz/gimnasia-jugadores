import React, { useState, useEffect } from "react";
import AddPlayer from "./components/addPlayer";
import IconOutline from "./components/iconOutline";
import IconSolid from "./components/iconSolid";
import Loading from "./components/loading";
import Payments from "./components/payments";
import Players from "./components/players";
import Subjects from "./components/subjects";
import Expenses from "./components/expenses";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Jugadores");
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const checkLogin = () => {
    if (username.toLowerCase() === "gimnasia" && password === "Gimnasia2022;") {
      setIsLogged(true);
      localStorage.setItem("loggedGimnasiaAdmin", true);
    }
  };

  useEffect(() => {
    setIsLogged(!!localStorage.getItem("loggedGimnasiaAdmin"));
  }, []);

  const tabs = {
    "Agregar Jugador": {
      component: (
        <AddPlayer
          switchToPlayersTab={() => setActiveTab("Jugadores")}
          setIsLoading={setIsLoading}
        />
      ),
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      iconActive:
        "M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z",
    },
    Jugadores: {
      component: <Players setIsLoading={setIsLoading} />,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      iconActive:
        "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z",
    },
    Pagos: {
      component: <Payments setIsLoading={setIsLoading} />,
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      iconActive:
        "M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z",
    },
    Asuntos: {
      component: <Subjects setIsLoading={setIsLoading} />,
      icon: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z",
      iconActive:
        "M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z",
    },
    Gastos: {
      component: <Expenses setIsLoading={setIsLoading} />,
      icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
      iconActive:
        "M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z",
    },
  };

  const loggedComponent = (
    <div>
      {isLoading && <Loading />}
      <h1 className="text-center text-2xl py-4 font-bold">{activeTab}</h1>
      {tabs[activeTab].component}
      <div className="tabs w-full z-40 fixed bottom-0 bg-white">
        {Object.keys(tabs).map((tab) => (
          <a
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab tab-lg tab-bordered flex-1 truncate px-2 ${
              activeTab === tab ? "tab-active" : ""
            }`}
          >
            {activeTab !== tab ? (
              <IconOutline svg={tabs[tab].icon} />
            ) : (
              <IconSolid svg={tabs[tab].iconActive} />
            )}
          </a>
        ))}
      </div>
    </div>
  );
  const loginComponent = (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-4">
      <input
        type="text"
        placeholder="Ingrese usuario"
        className="input input-min-height input-bordered w-full md:w-1/2 mb-4"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Ingrese contraseña"
        className="input input-min-height input-bordered w-full  md:w-1/2 mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={checkLogin} className="btn w-full md:w-1/2">
        Loguearse
      </button>
    </div>
  );
  return isLogged ? loggedComponent : loginComponent;
}
