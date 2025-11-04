import React from "react";
import { NavLink } from "react-router-dom";
import Cards from "./Cards";

const HomeProjects = () => {
  return (
    <div className="mt-10">
      {/* 🔹 Heading */}
      <div className="flex flex-col gap-0.5">
        <h3>Featured</h3>
        <h2>Projects</h2>
      </div>

      {/* 🔹 Cards Section */}
      <Cards />

      {/* 🔹 Centered Button with NavLink */}
      <div className="flex justify-center py-6">
        <NavLink
          to="/projects"
          className="relative text-sm border-none font-semibold cursor-pointer rounded-lg 
                     z-[1] bg-transparent group transition-all duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        >
          <div
            className="flex items-center justify-between gap-2 min-h-[40px] px-6 rounded-md 
                        shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
                        transition-all duration-[200ms] ease-[cubic-bezier(0.77,0,0.175,1)] 
                        hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            style={{
              backgroundColor: "var(--color-card-bg)",
              color: "var(--color-text)",
              fontFamily: "var(--font-main)",
            }}
          >
            Show All Projects
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default HomeProjects;
