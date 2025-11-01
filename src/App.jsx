import React, { useEffect, useState } from "react";
import Navbar from "../src/components/Ui/Layouts/Navbar";
import Home from "./Pages/Home";
import CircleCanvas from "./components/Ui/CircleCanvas";
import DarkModeToggle from "./components/Ui/DarkModeToggle";
import DogFollower from "./components/Ui/DogFollower";
import Introduction from "./components/Ui/Layouts/Introduction";

function App() {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000); // 1 second blur time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden  ">
      {/* 🔹 Pure Transparent Blur Overlay */}
      <div
        style={{ backdropFilter: "blur(10px)" }}
        className={`fixed inset-0 z-[999] transition-all duration-500 ${loader
            ? "opacity-100"
            : "opacity-0 backdrop-blur-0 pointer-events-none"
          }`}
      ></div>

      {/* Main Content */}
      <div
      >
        {/* <DogFollower /> */}
        <Navbar />
        <Introduction/>
        {/* <Home /> */}
      </div>
    </div>
  );
}

export default App;
