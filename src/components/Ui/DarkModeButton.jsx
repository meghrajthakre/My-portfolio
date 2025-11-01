import React from "react";

const DarkModeButton = () => {
  return (
    <>
      <button
        className="
          p-3 rounded-xl bg-[#f5f5f5] text-[#0d0d0d] 
          shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
          hover:shadow-[inset_0_3px_8px_rgba(0,0,0,0.12)]
          active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.18)]
          cursor-pointer transition-all duration-1000 ease-in-out
          active:scale-110 hover:scale-105
          relative overflow-hidden 
        "
      >
        {/* subtle warm glow on hover */}
        <span
          className="
            absolute inset-0 bg-gradient-to-tr from-yellow-400/30 to-transparent
            rounded-xl opacity-0 hover:opacity-100 
            transition-opacity duration-1000 ease-in-out
          "
        ></span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-4 text-yellow-500 transition-transform duration-500 ease-in-out hover:rotate-[25deg]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5V3m0 18v-1.5M4.5 12H3m18 0h-1.5M6.343 6.343 5.05 5.05m13.607 13.607-1.293-1.293M6.343 17.657l-1.293 1.293m13.607-13.607L17.657 6.343M16.243 12a4.243 4.243 0 1 1-8.486 0 4.243 4.243 0 0 1 8.486 0Z"
          />
        </svg>
      </button>
    </>
  );
};

export default DarkModeButton;
