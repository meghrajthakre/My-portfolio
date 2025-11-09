import React, { useEffect, useState } from "react";
import Navbar from "../src/components/Ui/Layouts/Navbar";
import Home from "./Pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Work from "./Pages/Work";
import Blog from "./Pages/Blog";
import { AnimatePresence } from "framer-motion";
import Footer from "./Pages/Footer";
import SmoothScroll from "./components/Animation/SmoothScroll";
import ScrollToTop from "./common/ScrollToTop";
import Quotes from "./common/Quotes";
import Resume from './Pages/Resume';
import Contact from "./Pages/Contact/Contact";
import Projects from "./Pages/Projects/Projects";
import ProjectDetails from "./Pages/Projects/ProjectDetails";

function App() {
  const location = useLocation();
  const [loader, setLoader] = useState(true);

  // 🔹 Loader blur effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000); // loader duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* 🔹 Transparent Blur Loader Overlay */}
      <div
        style={{ backdropFilter: "blur(10px)" }}
        className={`fixed max-w-3xl m-auto inset-0 z-[999] transition-all duration-500 ${loader
            ? "opacity-100"
            : "opacity-0 backdrop-blur-0 pointer-events-none"
          }`}
      ></div>

      {/* 🔹 Main Content */}
      <div>
        <Navbar />
        <SmoothScroll />
        <AnimatePresence mode="wait">
          <ScrollToTop />
          <Routes location={location} key={location.pathname}>
            <Route index path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            
          </Routes>
        </AnimatePresence>
        <Quotes />
        <Footer />
      </div>
    </div>
  );
}

export default App;
