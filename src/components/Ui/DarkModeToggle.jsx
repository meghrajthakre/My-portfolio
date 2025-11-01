import React from "react";
import DarkModeButton from "./DarkModeButton";
import LightModeButton from "./LightModeButton";

const DarkModeToggle = ({ isDark, onClickMethod }) => {
  const onClickWrapper = () => {
    // Always trigger from top-right corner of viewport
    const customEventData = {
      x: window.innerWidth,
      y: 0,
    };

    // Dispatch circle animation event immediately
    const toggleEvent = new CustomEvent("darkModeToggle", { detail: customEventData });
    window.dispatchEvent(toggleEvent);

    // Delay actual theme change to sync with animation
    setTimeout(() => {
      onClickMethod(!isDark);
    }, 500); // match CircleCanvas animation duration
  };

  return (
    <div
      onClick={onClickWrapper}
      style={{
        position: "absolute",
        top: "-20px",
        right: "8px",
        background: "none",
        borderColor: isDark ? "#fff" : "#111",
        cursor: "pointer",
        color: isDark ? "#fff" : "#111",
        fontSize: "18px",
        transition: "all 1s ease",
      }}
    >
      {isDark ? <LightModeButton /> : <DarkModeButton />}
    </div>
  );
};

export default DarkModeToggle;
