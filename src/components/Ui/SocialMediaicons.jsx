import React from "react";

const SocialMediaicons = () => {
  const iconClass = `
    w-6 h-6
    text-[var(--color-secondary-text)]
    transition-all duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]
    group-hover:scale-110 group-hover:text-[var(--color-primary-text)]
  `;

  const icons = [
    {
      href: "https://x.com/meghraj_thakre1",
      label: "Twitter / X",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={iconClass}
        >
          <path d="M214.75,211.71l-62.6-98.38 61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34 102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72 40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208 62.57,48h29L193.43,208Z" />
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/in/meghraj-thakre-01a09b23a/",
      label: "LinkedIn",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={iconClass}
        >
          <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
        </svg>
      ),
    },
    {
      href: "https://github.com/meghrajthakre",
      label: "GitHub",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={iconClass}
        >
          <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
        </svg>
      ),
    },
    {
      href: "https://www.instagram.com/meghraj_thakre/",
      label: "Instagram",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={iconClass}
        >
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
        </svg>
      ),
    },
    {
      href: "mailto:meghrajthakre444@gmail.com",
      label: "Gmail",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={iconClass}
        >
          <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-5">
      {icons.map(({ href, label, svg }) => (
        <div key={label} className="relative group">
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="flex items-center justify-center"
          >
            {svg}
          </a>

          {/* Tooltip */}
          <span
            className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 invisible 
                   group-hover:opacity-100 group-hover:visible group-hover:-translate-y-1 
                   text-[var(--color-text)] bg-[var(--color-bg-secondary)] 
                   text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ease-out 
                   whitespace-nowrap shadow-lg dashed 
                   border-[var(--color-border)] z-[99] backdrop-blur-md"
            style={{
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
            }}
          >
            {label}
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 
                     border-x-transparent border-t-4"
              style={{
                borderTopColor: "var(--color-bg-secondary)",
              }}
            ></span>
          </span>
        </div>
      ))}
    </div>

  );

};

export default SocialMediaicons;
