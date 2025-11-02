import React from "react";

const GetInTouchButton = () => {
  return (
    <button
      className="relative border-none text-[14px] font-semibold cursor-pointer rounded-md 
      z-[1] bg-transparent group transition-all duration-200 ease-in-out hover:brightness-110"
    >
      <div
        className="flex items-center justify-between gap-2 min-h-[44px] px-3 rounded-lg 
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
        hover:shadow-[inset_0_0_8px_var(--color-text)]"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-bg)",
          fontFamily: "var(--font-main)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          stroke="var(--color-bg)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="4,4 20,12 4,20 7,13 4,4" />
        </svg>
        Get in touch
      </div>
    </button>
  );
};

export default GetInTouchButton;
