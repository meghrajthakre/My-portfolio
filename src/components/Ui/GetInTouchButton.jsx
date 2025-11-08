import React from "react";
import { NavLink } from "react-router-dom";

const GetInTouchButton = () => {
  return (
    <NavLink
      to="/contact" // ✅ update this route as per your contact page path
      className="relative border-none font-semibold cursor-pointer rounded-md 
      z-[1] bg-transparent group transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]
      hover:brightness-110"
    >
      <div
        className="font-medium flex items-center justify-between gap-2 min-h-[40px] px-3 sm:px-4 rounded-lg
        transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] text-sm "
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-bg)", // keeps your original text color
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
          stroke="var(--color-bg)" // keeps the same color as text
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="4,4 20,12 4,20 7,13 4,4" />
        </svg>

        Get in touch
      </div>
    </NavLink>
  );
};

export default GetInTouchButton;
