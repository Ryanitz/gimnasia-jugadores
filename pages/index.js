import React, { useState } from "react";
import AddPlayer from "./components/addPlayer";
import Players from "./components/players";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Jugadores");
  const tabs = ["Agregar", "Jugadores"];
  return (
    <div>
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
      {activeTab === tabs[0] && <AddPlayer />}
      {activeTab === tabs[1] && <Players />}
    </div>
  );
}
