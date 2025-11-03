import React from "react";

const GetInTouchButton = () => {
  return (
    <button
      className="relative border-none  font-semibold cursor-pointer rounded-md 
      z-[1] bg-transparent group transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]
      hover:brightness-110"
    >
      <div
        className="font-medium flex text-sm items-center justify-between gap-2 min-h-[40px] px-4 rounded-lg
        transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]
        group-hover:shadow-[inset_0_0_12px_var(--color-text),0_0_6px_var(--color-accent)]"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-bg)",
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
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <polygon points="4,4 20,12 4,20 7,13 4,4" />
        </svg>

        Get in touch
      </div>
    </button>
  );
};

export default GetInTouchButton;
