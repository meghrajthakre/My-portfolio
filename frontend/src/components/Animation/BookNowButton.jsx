import React from "react";

const BookNowButton = () => {
  return (
    <button
      className="
        group relative flex items-center justify-center cursor-pointer
        px-3 rounded-md text-sm font-semibold
        bg-[var(--color-icons-bg)]
        border border-dashed border-[var(--color-muted)]
        hover:shadow-[0_4px_14px_-3px_rgba(0,0,0,0.2)]
        overflow-hidden transition-all duration-500 ease-in-out
      "
    >
      <div className="flex items-center gap-1 relative ">
        {/* Logo */}
        <img
          src="/Logo/logo (1).webp"
          alt="logo"
          className="w-6 h-6 object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
        />

        {/* Middle animated text (+ You) */}
        <p
          className="
             text-[var(--color-text)] font-bold
            max-w-0 overflow-hidden whitespace-nowrap
            transition-all duration-500 ease-in-out
            group-hover:max-w-[4rem] group-hover:ml-1
          "
        >
          + You
        </p>

        {/* Main text */}
        <p className="text-[var(--color-text)] transition-all duration-500 ease-in-out">
          Book a Free Call
        </p>
      </div>
    </button>
  );
};

export default BookNowButton;
