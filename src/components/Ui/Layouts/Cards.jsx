import React from "react";
import SpotlightCard from "./SpotlightCard";
import { NavLink } from "react-router-dom";
import { ProjectsData } from './../../../Data/ProjectsData';
import Tooltip from './../../../common/Tooltip';

const Cards = () => {



  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
      {/* Loop through all projects */}
      {ProjectsData.slice(0, 4).map((project, index) => (
        <SpotlightCard
          key={index}
          className="transition-transform duration-300 bg-[var(--color-card-bg)]"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          {/* 📸 Project Image */}
          <img
            src={project.image}
            alt={project.title}
            className="rounded-2xl object-center object-cover mb-3"
          />

          {/* 📦 Card Content */}
          <div className="p-5">
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
                  className="transition-transform duration-300 hover:scale-125"
                >
                  <div className="p-2 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors duration-300">
                    <img
                      src="/src/assets/technologySvgs/weeeb.svg"
                      alt="Website"
                      className="w-7 h-7 invert dark:invert-0 transition-all duration-300"
                    />
                  </div>
                </NavLink>

                {/* 💻 GitHub */}
                <NavLink
                  to={project.github}
                  target="_blank"
                  className="transition-transform duration-300 hover:scale-125"
                >
                  <img
                    src="/src/assets/technologySvgs/github1.svg"
                    alt="GitHub"
                    className="w-8 h-8"
                  />
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
            <div className="mt-3">
              <span>Technologies</span>
              <div className="flex gap-4 mt-2">
                {project.techStack.map((tech, i) => (
                  <Tooltip key={tech.name} text={tech.name}>
                    <img
                      key={i}
                      src={tech.icon}
                      alt={tech.name}
                      className="w-5 h-5 cursor-pointer transition-all duration-300 hover:scale-125 "
                    />

                  </Tooltip>
                ))}
              </div>
            </div>

            {/* ⚡ System Status + View Details */}
            <div className="flex py-6 items-center justify-between">
              {/* ✅ Active System */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <h3 className="text-[var(--color-text)] font-medium">
                  {project.status}
                </h3>
              </div>

              {/* 🔗 View Details */}
              <NavLink
                to="/"
                className="flex items-center gap-1 text-[var(--color-accent)] hover:underline transition-all duration-300"
              >
                <h3>View Details</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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

export default Cards;
