import React, { useEffect, useState } from "react";
import Navbar from "../src/components/Ui/Layouts/Navbar";
import Home from "./Pages/Home";
import CircleCanvas from "./components/Ui/CircleCanvas";
import DarkModeToggle from "./components/Ui/DarkModeToggle";
import DogFollower from "./components/Ui/DogFollower";

function App() {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 2000); // 2s blur time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Transparent Blur Overlay */}
      <div
        className={`fixed inset-0 z-[9999] transition-all duration-1000 
          ${loader ? "opacity-100 backdrop-blur-lg bg-white/10 dark:bg-black/10" 
                   : "opacity-0 backdrop-blur-0 pointer-events-none"}`}
      ></div>

      {/* Main Content */}
      <div
        className={`transition-all duration-1000 ${
          loader ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* <DogFollower /> */}
        <Navbar />
        <Home />
      </div>
    </div>
  );
}

export default App;
