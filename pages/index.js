import React, { useState } from "react";
import AddPlayer from "./components/addPlayer";
import Players from "./components/players";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Jugadores");
  const tabs = ["Agregar Jugadores", "Jugadores"];
  return (
    <div>
      <div className="tabs w-full z-50 relative">
        {tabs.map((tab) => (
          <a
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab tab-lg tab-bordered flex-1 ${
              activeTab === tab ? "tab-active" : ""
            }`}
          >
            {tab}
          </a>
        ))}
      </div>
      {activeTab === "Jugadores" && <Players />}
      {activeTab === "Agregar Jugadores" && <AddPlayer />}
    </div>
  );
}
