import React, { memo, Suspense } from "react";
import { NavLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import SpotlightCard from "./SpotlightCard";
import { ProjectsData } from "../../../data/ProjectsData";

// Lazy load Tooltip to reduce initial bundle size
const Tooltip = React.lazy(() => import("./../../../common/Tooltip"));

// ✅ Extracted small sub-components
const ProjectImage = ({ src, title }) => (
  <div className="w-full h-48 overflow-hidden rounded-2xl mb-3">
    <img
      src={src}
      alt={title}
      loading="lazy"
      className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105 will-change-transform"
    />
  </div>
);

const ProjectTechStack = ({ stack }) => (
  <div className="mt-3">
    <span>Technologies</span>
    <div className="flex gap-4 mt-2">
      {stack.slice(0, 5).map((tech) => {
        const TechIcon = tech.Icon;
        return (
          <Suspense key={tech.name} fallback={<span />}>
            <Tooltip text={tech.name}>
              <TechIcon
                className="w-5 h-5 cursor-pointer transition-transform duration-300"
                style={{ color: tech.color }}
              />
            </Tooltip>
          </Suspense>
        );
      })}
    </div>
  </div>
);

const handleStopPropagation = (e) => e.stopPropagation();

const Cards = ({ num }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 ">
      {ProjectsData.slice(0, num).map((project) => (
        <SpotlightCard
          key={project.id}
          className="border border-1 transition-transform duration-300 bg-[var(--color-card-bg)] flex flex-col cursor-pointer"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          {/* 📸 Project Image */}
          <ProjectImage src={project.image} title={project.title} />

          {/* 📦 Card Content */}
          <div className="px-6 my-1 flex flex-col flex-1 justify-between">
            {/* 🔹 Title + Icons */}
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--color-text)] text-sm font-semibold">
                {project.title}
              </h2>

              <div className="flex items-center gap-2">
                {/* 🌐 Website */}
                <NavLink
                  to={project.website}
                  target="_blank"
                  onClick={handleStopPropagation}
                >
                  <Suspense fallback={<span />}>
                    <Tooltip text="Visit Website">
                      <FaEarthAmericas className="w-6 h-6 hover:text-blue-500 transition-transform duration-300" />
                    </Tooltip>
                  </Suspense>
                </NavLink>

                {/* 💻 GitHub */}
                <NavLink
                  to={project.github}
                  target="_blank"
                  onClick={handleStopPropagation}
                >
                  <Suspense fallback={<span />}>
                    <Tooltip text="Code">
                      <FaGithub className="w-6 h-6 hover:text-blue-500 transition-transform duration-300" />
                    </Tooltip>
                  </Suspense>
                </NavLink>
              </div>
            </div>

            {/* 📝 Description */}
            <span className="text-[var(--color-secondary-text)] text-md mt-1 block">
              {project.description.length > 80
                ? project.description.slice(0, 80) + "..."
                : project.description}
            </span>

            {/* ⚙️ Tech Stack */}
            <ProjectTechStack stack={project.techStack} />

            {/* ⚡ System Status + View Details */}
            <div className="flex py-6 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <h3 className="text-[var(--color-text)] font-medium">
                  {project.status}
                </h3>
              </div>

              {/* ✅ View Details link */}
              <NavLink
                to={`/projects/${project.id}`}
                onClick={handleStopPropagation}
                className="flex items-center gap-1 text-[var(--color-accent)] hover:underline transition-all duration-300"
              >
                <h3>View Details</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="2" y1="12" x2="20" y2="12" />
                  <polyline points="14 6 20 12 14 18" />
                </svg>
              </NavLink>
            </div>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
};

export default memo(Cards);
