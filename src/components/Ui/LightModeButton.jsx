import React from "react";

const LightModeButton = () => {
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
    <div>
      <button
        onClick={playClickSound}
        className="
          p-3 rounded-md bg-[#0d0d0d] text-white 
          shadow-[inset_0_2px_6px_rgba(255,255,255,0.06)]
          hover:shadow-[inset_0_3px_8px_rgba(255,255,255,0.1)]
          active:shadow-[inset_0_4px_10px_rgba(255,255,255,0.15)]
          transition-all duration-500 ease-in-out
          active:scale-110 
          hover:bg-[#1a1a1a] relative overflow-hidden cursor-pointer
        "
      >
        {/* smooth cool cyan glow on hover */}
       

        <svg
          className="size-4 text-cyan-400 transition-transform duration-500 ease-in-out hover:-rotate-[25deg]"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>
        </svg>
      </button>
    </div>
  );
};

export default LightModeButton;
