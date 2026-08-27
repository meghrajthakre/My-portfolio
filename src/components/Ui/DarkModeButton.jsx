const DarkModeButton = () => {
  return (
      <span
        aria-hidden="true"
        className="
          flex size-10 items-center justify-center rounded-md bg-[#ffffff] text-[#0d0d0d]
          shadow-[inset_0_1px_6px_rgba(0,0,0,0.1),inset_0_-2px_6px_rgba(255,255,255,0.4)]


           hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.18)]
          transition-all duration-500 ease-in-out
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
      </span>
  );
};

export default DarkModeButton;
