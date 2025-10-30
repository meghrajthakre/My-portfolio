import React, { useState, useEffect } from "react";
import DarkModeButton from "../DarkModeButton";
import LightModeButton from "../LightModeButton";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  const handleMode = () => setIsDark((prev) => !prev);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark"); // 👈 important, :root.dark use krta hai
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [isDark]);

  return (
    <div className="container mx-auto max-w-3xl px-4 animate-fade-in-blur sticky top-0 z-20 rounded-md py-4 backdrop-blur-sm">
      <div className="w-full flex justify-between items-center px-5">
        {/* ---------- Left: Nav Links ---------- */}
        <div className="flex items-baseline gap-4 text-[var(--color-text)]">
          <a href="#">
            <img
              className={`h-12 w-12 rounded-md border border-gray-200 transition-all duration-300 ease-in-out hover:scale-90  ${isDark ? "bg-yellow-300" : "bg-blue-300"
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
        <div onClick={handleMode} className="cursor-pointer px-2">
          {isDark ? <LightModeButton /> : <DarkModeButton />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
