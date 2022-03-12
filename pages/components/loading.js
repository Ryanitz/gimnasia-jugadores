import React, { useEffect, useState } from "react";

export default function Loading() {
  const [timeout, setTimeout] = useState(null);
  const [dots, setDots] = useState("");

  useEffect(() => {
    setTimeout(
      window.setTimeout(() => {
        if (dots.length === 8) setDots("");
        else setDots(dots + ".");
      }, 300)
    );
  }, [dots]);

  useEffect(() => {
    if (timeout) clearTimeout(timeout);
  }, []);

  return (
    <div className="z-50 fixed h-screen w-screen bg-black bg-opacity-50 text-white text-2xl flex justify-center items-center">
      {dots}
    </div>
  );
}
