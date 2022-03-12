import React, { useState } from "react";
import AddPlayer from "./components/addPlayer";
import Loading from "./components/loading";
import Payments from "./components/payments";
import Players from "./components/players";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Jugadores");
  const tabs = ["Agregar", "Jugadores", "Pagos"];

  const tabsComponents = {
    Agregar: (
      <AddPlayer
        switchToPlayersTab={() => setActiveTab("Jugadores")}
        setIsLoading={setIsLoading}
      />
    ),
    Jugadores: <Players setIsLoading={setIsLoading} />,
    Pagos: <Payments setIsLoading={setIsLoading} />,
  };
  return (
    <div>
      {isLoading && <Loading />}
      <div className="tabs w-full z-50 relative">
        {tabs.map((tab) => (
          <a
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab tab-lg tab-bordered flex-1 truncate px-2 ${
              activeTab === tab ? "tab-active" : ""
            }`}
          >
            {tab}
          </a>
        ))}
      </div>
      {tabsComponents[activeTab]}
    </div>
  );
}
