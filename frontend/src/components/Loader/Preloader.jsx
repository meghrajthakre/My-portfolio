import React from "react";

const Preloader = () => {
  return (
    <div
      className="
        fixed z-[9999]
        backdrop-blur-sm bg-black/40
        flex items-center justify-center
        animate-fade-in opacity-0
      "
    >
      {/* Optional: Logo ya text (agar chaahe to) */}
      {/* <img src='/src/assets/Logo/logo (1).webp' alt='logo' className='h-16 w-16 animate-pulse opacity-80' /> */}
    </div>
  );
};

export default Preloader;
