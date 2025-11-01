import React, { useState, useEffect } from "react";
import CircleCanvas from "../CircleCanvas";
import DarkModeToggle from "../DarkModeToggle";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  // 🌈 Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  // 🌗 Apply theme to <html>
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
      {/* 🌑 Circle animation overlay */}
      <CircleCanvas className="absolute left-2" isDark={isDark} />

      {/* 🌟 Navbar Section */}
      <div className="container mx-auto max-w-3xl px-4 sticky top-0 z-50 rounded-md py-4 backdrop-blur-sm transition-all duration-500">
        <div className="w-full flex justify-between items-center px-5">
          {/* ---------- Left: Logo + Links ---------- */}
          <div className="flex items-baseline gap-4 text-[var(--color-text)]">
            <a href="#">
              <img
                className={`h-12 w-12 rounded-md border border-gray-200 transition-all duration-300 ease-in-out hover:scale-90 ${
                  isDark ? "bg-yellow-300" : "bg-blue-300"
                }`}
                src="/src/assets/Logo/logo (1).webp"
                alt="Logo"
                loading="lazy"
              />
            </a>
            <a className="hover:underline hover:decoration-2 hover:underline-offset-4 transition-all duration-300 ease-in-out" href="#">
              Work
            </a>
            <a className="hover:underline hover:decoration-2 hover:underline-offset-4 transition-all duration-300 ease-in-out" href="#">
              Blogs
            </a>
            <a className="hover:underline hover:decoration-2 hover:underline-offset-4 transition-all duration-300 ease-in-out" href="#">
              Projects
            </a>
          </div>

          {/* ---------- Right: Mode Toggle ---------- */}
          <div className="relative">
            <DarkModeToggle isDark={isDark} onClickMethod={setIsDark} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
