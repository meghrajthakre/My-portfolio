import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import PortfolioTerminalDialog from "./components/layout/Navbar/PortfolioTerminalDialog";
import ScrollToTop from "./common/ScrollToTop";
import Quotes from "./components/quotes/Quotes";
import Footer from "./Pages/Footer";
import LoadingFallback from "./components/Loader/LoadingFallback";
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
import BottomBlur from "./components/Ui/BottomBlur";
import { useVisitorAnalytics } from "./hooks/useVisitorAnalytics";

function App() {
  useVisitorAnalytics();
  return (
    <div className="relative">
      <div className="site-grid-background" aria-hidden="true" />
      <Navbar />
      <PortfolioTerminalDialog />

      <Suspense fallback={<LoadingFallback />}>
        <ScrollToTop />
        <Routes>
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
      </Suspense>
        <BackToTop/>
      <Quotes />
      <Footer />
      <BottomBlur />
    </div>
  );
}

export default App;
