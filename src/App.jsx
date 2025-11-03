import React, { useEffect, useState } from "react";
import Navbar from "../src/components/Ui/Layouts/Navbar";
import Home from "./Pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Work from './Pages/Work';
import Projects from './Pages/Projects';
import Blog from './Pages/Blog';
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation()
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000); // 1 second blur time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative ">
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
        {/* <DogFollower/> */}
        <Navbar />
        <AnimatePresence mode="wait"> 
          <Routes location={location} key={location.pathname}>
            <Route index path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </AnimatePresence>


      </div>
    </div>
  );
}

export default App;
