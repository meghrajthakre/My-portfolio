import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import SmoothScroll from "./components/Animation/SmoothScroll";
import ScrollToTop from "./common/ScrollToTop";
import Quotes from "./common/Quotes";
import Footer from "./Pages/Footer";
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

function App() {
  const location = useLocation();
  return (
    <div className="relative">
      {/* 🔹 Loader Blur Effect */}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
        <BackToTop/>
      <Quotes />
      <Footer />
    </div>
  );
}

export default App;
