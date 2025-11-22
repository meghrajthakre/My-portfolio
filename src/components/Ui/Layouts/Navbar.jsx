import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import CircleCanvas from './../CircleCanvas';
import DarkModeToggle from './../DarkModeToggle';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <>
      <CircleCanvas className="absolute left-2" isDark={isDark} />

      <div className="container mx-auto max-w-3xl px-3 sticky top-0 z-50 rounded-md py-4 backdrop-blur-sm transition-all duration-500">

        <div className="w-full flex justify-between items-center px-3 sm:px-5">

          {/* LEFT SECTION */}
          <div className="flex items-baseline gap-3 sm:gap-4 text-[var(--color-text)] 
                          overflow-x-auto no-scrollbar whitespace-nowrap">

            <NavLink to="/">
              <img
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-md border border-gray-200 
                transition-all duration-300 ease-in-out hover:scale-90 
                ${isDark ? "bg-yellow-300" : "bg-blue-300"}`}
                src="/Logo/logo (1).webp"
                alt="Logo"
                loading="lazy"
              />
            </NavLink>

            <NavLink
              to="/work"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in-out text-sm sm:text-base ${
                  isActive
                    ? "underline decoration-2 underline-offset-4 text-[var(--color-accent)]"
                    : "hover:underline hover:decoration-2 hover:underline-offset-4"
                }`
              }
            >
              Component
            </NavLink>

            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in-out text-sm sm:text-base ${
                  isActive
                    ? "underline decoration-2 underline-offset-4 text-[var(--color-accent)]"
                    : "hover:underline hover:decoration-2 hover:underline-offset-4"
                }`
              }
            >
              Blogs
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in-out text-sm sm:text-base ${
                  isActive
                    ? "underline decoration-2 underline-offset-4 text-[var(--color-accent)]"
                    : "hover:underline hover:decoration-2 hover:underline-offset-4"
                }`
              }
            >
              Projects
            </NavLink>
          </div>

          {/* RIGHT SECTION */}
          <div className="relative">
            <DarkModeToggle
              isDark={isDark}
              onClickMethod={setIsDark}
              className="w-7 h-7 sm:w-10 sm:h-10"
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
