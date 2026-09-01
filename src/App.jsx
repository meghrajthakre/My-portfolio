import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import SmoothScroll from "./components/Animation/SmoothScroll";
import ScrollToTop from "./common/ScrollToTop";
import Quotes from "./common/Quotes";
import Footer from "./Pages/Footer";
import { InfinityLoop } from "./components/Loader/InfinityLoop";
const Home = lazy(() => import("./Pages/Home"));
const Projects = lazy(() => import("./Pages/Projects/Projects"));
const Work = lazy(() => import("./Pages/Work"));
const Blog = lazy(() => import("./Pages/Blog"));
const ProjectDetails = lazy(() => import("./Pages/Projects/ProjectDetails"));
const Resume = lazy(() => import("./Pages/Resume"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const Gears = lazy(() => import("./Pages/Gears"));
const VscodeSetup = lazy(() => import("./Pages/VscodeSetup"));
const NotFound = lazy(() => import("./Pages/NotFound"));
import BackToTop from "./components/Ui/BackToTop";

const StartupReady = ({ onReady }) => {
  useEffect(() => {
    let isCancelled = false;

    const revealApp = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      if (!isCancelled) {
        window.requestAnimationFrame(onReady);
      }
    };

    revealApp();
    return () => {
      isCancelled = true;
    };
  }, [onReady]);
  return null;
};

function App() {
  const location = useLocation();
  const [isStarting, setIsStarting] = useState(true);
  const [isStartupLeaving, setIsStartupLeaving] = useState(false);

  const handleStartupReady = useCallback(() => setIsStartupLeaving(true), []);

  useEffect(() => {
    if (!isStartupLeaving) return undefined;
    const removeTimer = window.setTimeout(() => setIsStarting(false), 700);
    return () => window.clearTimeout(removeTimer);
  }, [isStartupLeaving]);
  return (
    <div className="relative">
      <div className="site-grid-background" aria-hidden="true" />
      {/* 🔹 Loader Blur Effect */}
      <Navbar />
      {isStarting && (
        <div className={`route-loading-overlay ${isStartupLeaving ? "is-leaving" : ""}`} role="status" aria-label="Loading portfolio">
          <div className="route-loading-indicator">
            <InfinityLoop className="h-12 w-16 text-[var(--logo-bg)]" />
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--logo-bg)]">thinking...</span>
          </div>
        </div>
      )}

      {/* 🔹 Wrap Routes in Suspense for lazy loading fallback */}
      <Suspense fallback={<div className="min-h-[40vh]" aria-label="Loading page" />}>
        <StartupReady onReady={handleStartupReady} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
        <BackToTop/>
      <Quotes />
      {!isStarting && <Footer />}
    </div>
  );
}

export default App;
