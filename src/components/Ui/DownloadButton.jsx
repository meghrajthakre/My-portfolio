import React from "react";

const DownloadButton = () => {
  return (
    <button
      className="relative text-sm border-none  font-semibold cursor-pointer rounded-lg 
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

      <div
        className="absolute inset-0 flex items-center justify-center max-w-[90%] mx-auto 
        z-[-1] rounded-md transform translate-y-0 
        transition-all duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)] 
        group-hover:translate-y-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]"
        style={{
          backgroundColor: "var(--color-accent)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="var(--color-bg)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-docs"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>

      <style>
        {`
          @keyframes docs {
            0% { transform: translateY(0%); }
            50% { transform: translateY(-15%); }
            100% { transform: translateY(0%); }
          }
          .animate-docs polyline,
          .animate-docs line {
            animation: docs 1s infinite;
          }
        `}
      </style>
    </button>
  );
};

export default DownloadButton;
