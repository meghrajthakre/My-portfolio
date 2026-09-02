import React from "react";
import { NavLink } from "react-router-dom";

const DownloadButton = () => {
  return (
    <NavLink
      to="/resume" // 👉 Change this path if needed (e.g. "/assets/resume.pdf")
      rel="noopener noreferrer"
      className="relative text-sm border-none font-semibold cursor-pointer rounded-lg 
      z-[1] bg-transparent group transition-all duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
    >
      <div
        className="flex items-center justify-between gap-2 min-h-[40px] px-4 rounded-md 
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
        transition-all duration-[200ms] ease-[cubic-bezier(0.77,0,0.175,1)] 
        hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "var(--font-main)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          stroke="var(--color-text)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Resume / CV
      </div>
    </NavLink>
  );
};

export default DownloadButton;
