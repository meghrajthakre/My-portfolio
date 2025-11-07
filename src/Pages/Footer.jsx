import React from "react";

const Footer = () => {
  return (
    <div className="mx-auto max-w-3xl py-10 pb-20 px-6 sm:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between text-center gap-3 sm:gap-0">
        <div className="flex flex-col text-[var(--color-secondary-text)]">
          <span className="text-sm sm:text-base">Design & Developed by Meghraj Thakre</span>
          <span className="text-sm sm:text-base">© 2025. All rights reserved.</span>
        </div>

        <span className="text-sm sm:text-base text-[var(--color-secondary-text)] break-all">
          Meghrajthakre444@gmail.com
        </span>
      </div>
    </div>
  );
};

export default Footer;
