import React from "react";

const Tooltip = ({
  text,
  children,
  placement = "top",
  fast = false,
  hoverOnly = false,
}) => {
  const isRight = placement === "right";
  const isBottom = placement === "bottom";
  const duration = fast ? "duration-100" : "duration-200";
  const focusVisibility = hoverOnly
    ? ""
    : "group-focus-within:visible group-focus-within:opacity-100";

  return (
    <div className="relative group inline-block">
      {children}
      <span
        className={`absolute z-[99] whitespace-nowrap rounded-lg border border-dashed border-[var(--color-border)] px-2 py-1 text-xs shadow-lg backdrop-blur-md transition-all ${duration} ease-out ${
          isRight
            ? "invisible top-1/2 left-full ml-2 -translate-y-1/2 opacity-0 group-hover:visible group-hover:translate-x-1 group-hover:opacity-100"
            : isBottom
              ? "invisible top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 group-hover:visible group-hover:translate-y-1 group-hover:opacity-100"
            : "invisible -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:visible group-hover:-translate-y-1 group-hover:opacity-100"
        } ${focusVisibility}`}
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
              : isBottom
                ? "bottom-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4"
              : "top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4"
          }`}
          style={{
            ...(isRight
              ? { borderRightColor: "var(--color-text)" }
              : isBottom
                ? { borderBottomColor: "var(--color-text)" }
              : { borderTopColor: "var(--color-bg-secondary)" }),
          }}
        />
      </span>
    </div>
  );
};

export default Tooltip;
