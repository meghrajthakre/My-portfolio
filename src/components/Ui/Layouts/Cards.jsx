import React from "react";
import SpotlightCard from "./SpotlightCard";
import { NavLink } from "react-router-dom";
import Tooltip from './../../../common/Tooltip';
import { ProjectsData } from "../../../data/ProjectsData";
import {  FaGithub } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";

const Cards = () => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
      {/* Loop through all projects */}
      {ProjectsData.slice(0, 4).map((project, index) => (
        <SpotlightCard
          key={index}
          className="transition-transform duration-300 bg-[var(--color-card-bg)] flex flex-col"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          {/* 📸 Project Image */}
          <div className="w-full h-48 overflow-hidden rounded-2xl mb-3">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* 📦 Card Content */}
          <div className="px-6 my-1 flex flex-col flex-1 justify-between">
            {/* 🔹 Title + Icons */}
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
                  className="transition-transform duration-300 "
                >
                  <div className="p-2 rounded-full">
                    <Tooltip key={'Visite Website'} text={'Visite Website'} >
                      <FaEarthAmericas className="w-6 h-6 hover:text-blue-500 " />
                    </Tooltip>
                  </div>
                </NavLink>

                {/* 💻 GitHub */}
                <NavLink
                  to={project.github}
                  target="_blank"
                  className="transition-transform duration-300 "
                >
                  <Tooltip key={'Code'} text={'Code'} >
                    <FaGithub className="w-6 h-6 hover:text-blue-500 " />

                  </Tooltip>
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
                {project.techStack.map((tech) => {
                  const TechIcon = tech.Icon;
                  return (
                    <Tooltip key={tech.name} text={tech.name}>
                      <TechIcon
                        className="w-5 h-5 cursor-pointer transition-transform duration-300 "
                        style={{ color: tech.color }}
                      />
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* ⚡ System Status + View Details */}
            <div className="flex py-6 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <h3 className="text-[var(--color-text)] font-medium">
                  {project.status}
                </h3>
              </div>

              <NavLink
                to="/"
                className="flex items-center   gap-1 text-[var(--color-accent)] hover:underline transition-all duration-300"
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

export default Cards;
