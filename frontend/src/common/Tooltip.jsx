import React from "react";

const Tooltip = ({ text, children, placement = "top" }) => {
  const isRight = placement === "right";

  return (
    <div className="relative group inline-block">
      {children}
      <span
        className={`absolute z-[99] whitespace-nowrap rounded-lg border border-dashed border-[var(--color-border)] px-2 py-1 text-xs shadow-lg backdrop-blur-md transition-all duration-200 ease-out ${
          isRight
            ? "invisible top-1/2 left-full ml-2 -translate-y-1/2 opacity-0 group-hover:visible group-hover:translate-x-1 group-hover:opacity-100"
            : "invisible -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:visible group-hover:-translate-y-1 group-hover:opacity-100"
        }`}
        style={{
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
        }}
      >
        {text}
        <span
          className={`absolute h-0 w-0 ${
            isRight
              ? "top-1/2 right-full -translate-y-1/2 border-y-4 border-y-transparent border-r-4"
              : "top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4"
          }`}
          style={{
            ...(isRight
              ? { borderRightColor: "var(--color-text)" }
              : { borderTopColor: "var(--color-bg-secondary)" }),
          }}
        />
      </span>
    </div>
  );
};

export default Tooltip;
