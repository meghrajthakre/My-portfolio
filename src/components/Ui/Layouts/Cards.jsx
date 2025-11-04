import React from "react";
import SpotlightCard from "./SpotlightCard";
import { NavLink } from "react-router-dom";

const Cards = () => {
  // 🧠 List of technologies to display with icons & links
  const techStack = [
    { name: "React", icon: "/src/assets/SvgsLogo/react.svg", link: "https://react.dev/" },
    { name: "JavaScript", icon: "/src/assets/SvgsLogo/js.svg", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "Node.js", icon: "/src/assets/SvgsLogo/node.svg", link: "https://nodejs.org/" },
    { name: "Express.js", icon: "/src/assets/SvgsLogo/exp.svg", link: "https://expressjs.com/" },
    { name: "MongoDB", icon: "/src/assets/SvgsLogo/mongodb.svg", link: "https://www.mongodb.com/" },
    { name: "GSAP", icon: "/src/assets/SvgsLogo/gsap.svg", link: "https://gsap.com/" },
    { name: "Framer Motion", icon: "src/assets/SvgsLogo/framerMotion.svg", link: "https://framer.com/" },
    { name: "Framer Motion", icon: "src/assets/SvgsLogo/framerMotion.svg", link: "https://framer.com/" },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
      {/* 🌟 Spotlight Card with glowing hover & animated lighting */}
      <SpotlightCard
        className="transition-transform duration-300 bg-[var(--color-card-bg)]"
        spotlightColor="rgba(0, 229, 255, 0.2)" 
      >
        {/* 📸 Top Featured Image */}
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000"
          alt="MongoDB Logo"
          className="rounded-2xl object-center object-contain mb-3"
        />

        {/* 📦 Card Content */}
        <div className="p-5">
          {/* 🔹 Title + Action Icons (Website / GitHub) */}
          <div className="flex items-center justify-between">
            <h2 className="text-[var(--color-text)] text-sm font-semibold">
              MongoDB
            </h2>

            <div className="flex items-center gap-2">
              {/* 🌐 Website Icon */}
              <NavLink
                to="#"
                className="transition-transform duration-300 hover:scale-125"
              >
                <div className="p-2 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors duration-300">
                  <img
                    src="src/assets/technologySvgs/weeeb.svg"
                    alt="Website"
                    className="w-7 h-7 invert dark:invert-0 transition-all duration-300"
                    style={{
                      filter: "var(--svg-theme-filter, invert(0))", // fallback if CSS var not found
                    }}
                  />
                </div>
              </NavLink>

              {/* 💻 GitHub Icon */}
              <NavLink
                to="#"
                className="transition-transform duration-300 hover:scale-125"
              >
                <img
                  src="src/assets/technologySvgs/github1.svg"
                  alt="GitHub"
                  className="w-8 h-8"
                />
              </NavLink>
            </div>
          </div>

          {/* 📝 Description */}
          <span className="text-[var(--color-secondary-text)] text-md mt-1 block">
            A comprehensive study platform with notes, flashcards, quizzes, AI chatbot, and interactive learning tools
          </span>

          {/* ⚙️ Tech Stack Icons */}
          <div className="mt-3">
            <span>Technologies</span>
            <div className="flex gap-2 mt-2">
              {techStack.slice(0, 5).map((tech, index) => (
                <img
                  key={index}
                  src={tech.icon}
                  alt={tech.name}
                  className="w-5 h-5 cursor-pointer transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_6px_var(--color-accent)]"
                />
              ))}
            </div>
          </div>

          {/* ⚡ System Status + View Details */}
          <div className="flex mt-3 items-center justify-between">
            {/* ✅ Active System Status */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <h3 className="text-[var(--color-text)] font-medium">
                All System Operational
              </h3>
            </div>

            {/* 🔗 View Details CTA */}
            <NavLink
              to="/"
              className="flex items-center gap-1 text-[var(--color-accent)] hover:underline transition-all duration-300"
            >
              <h3>View Details</h3>
              <img
                src="src/assets/technologySvgs/rightArrow.svg"
                className="w-5 h-5 text-white"
                alt="arrow"
              />
            </NavLink>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default Cards;
