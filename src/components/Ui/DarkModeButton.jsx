import React from "react";

const DarkModeButton = () => {
  // Create audio once (no re-creation on every click)
  const clickSound = new Audio("audio/computer-mouse-click-352734.mp3");

  // Optional: control volume
  clickSound.volume = 0.5;

  // Function to play sound instantly
  const playClickSound = () => {
    clickSound.currentTime = 0; // rewind sound for instant replay
    clickSound.play();
  };

  return (
    <>
      <button
      onClick={playClickSound}
        className="
          p-3 rounded-md bg-[#ffffff] text-[#0d0d0d] 
          shadow-[inset_0_1px_6px_rgba(0,0,0,0.1),inset_0_-2px_6px_rgba(255,255,255,0.4)]


           hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.18)]
          cursor-pointer transition-all duration-1000 ease-in-out
          active:scale-110 
          relative overflow-hidden 
        "
      >
     
       

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-4  transition-transform duration-500 ease-in-out hover:rotate-[50deg]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="black"
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
