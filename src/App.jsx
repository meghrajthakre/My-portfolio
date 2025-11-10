import React, { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../src/components/Ui/Layouts/Navbar";
import SmoothScroll from "./components/Animation/SmoothScroll";
import ScrollToTop from "./common/ScrollToTop";
import Quotes from "./common/Quotes";
import Footer from "./Pages/Footer";
import Home from "./Pages/Home";
import Projects from "./Pages/Projects/Projects";
// Lazy load pages
const Work = lazy(() => import("./Pages/Work"));
const Blog = lazy(() => import("./Pages/Blog"));
const ProjectDetails = lazy(() => import("./Pages/Projects/ProjectDetails"));
const Resume = lazy(() => import("./Pages/Resume"));
import Contact from './Pages/Contact/Contact';
import Gears from "./Pages/Gears";
import VscodeSetup from "./Pages/VscodeSetup";

function App() {
  const location = useLocation();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* 🔹 Loader Blur Effect */}
      <div
        style={{ backdropFilter: "blur(10px)" }}
        className={`fixed inset-0 z-[999] transition-all duration-500 ${
          loader ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      <Navbar />
      <SmoothScroll />

      {/* 🔹 Wrap Routes in Suspense for lazy loading fallback */}
      <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
        <AnimatePresence mode="wait">
          <ScrollToTop />
          <Routes location={location} key={location.pathname}>
            <Route index path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gears" element={<Gears />} />
            <Route path="/vscode-setup" element={<VscodeSetup />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <Quotes />
      <Footer />
    </div>
  );
}

export default App;
