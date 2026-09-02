import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <span
        className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 invisible 
                   group-hover:opacity-100 group-hover:visible group-hover:-translate-y-1 
                   text-[var(--color-text)] bg-[var(--color-bg-secondary)] 
                   text-xs px-2 py-1 rounded-lg transition-all duration-300 ease-out 
                   whitespace-nowrap shadow-lg border dashed 
                   border-[var(--color-border)] z-[99] backdrop-blur-md"
        style={{
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
        }}
      >
        {text}
        {/* Arrow */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 
                     border-x-transparent border-t-4"
          style={{
            borderTopColor: "var(--color-bg-secondary)",
          }}
        ></span>
      </span>
    </div>
  );
};

export default Tooltip;
