import React from "react";
import { FiLink, FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const SetUpDevelopment = () => {
  const items = [
    {
      icon: (
        <FiSettings
          className="w-12 h-9 sm:w-9 sm:h-9 text-gray-400 bg-[var(--color-icons-bg)] p-2 rounded-md"
        />
      ),
      title: "Gears Used",
      subtitle: "Productivity tools and gears I use to get my work done.",
      link: "/gears", // 👈 route for this card
    },
    {
      icon: (
        <FiLink
          className="w-8 h-8 sm:w-9 sm:h-9 text-gray-400 bg-[var(--color-icons-bg)] p-2 rounded-md"
        />
      ),
      title: "VS Code Setup",
      subtitle: "Setup of VS Code I use daily.",
      link: "/vscode-setup", // 👈 route for this card
    },
  ];

  return (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide">
          Development
        </h3>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Setup</h2>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <NavLink key={index} to={item.link}>
            <div
              className="group cursor-pointer flex items-center justify-between gap-6 bg-[var(--color-card-bg)]
              p-3 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]
              transition-all duration-300 hover:shadow-[0_4px_14px_-3px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center gap-6 sm:gap-8 ml-2">
                {item.icon}
                <div className="flex flex-col">
                  <h5 className="text-[16px] sm:text-[18px] font-semibold text-[var(--color-text)]">
                    {item.title}
                  </h5>
                  <span className="text-sm text-[var(--color-muted)]">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* SVG appears only on hover */}
              <div className="mr-4 opacity-0 -translate-x-[10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="2" y1="12" x2="20" y2="12" />
                  <polyline points="14 6 20 12 14 18" />
                </svg>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SetUpDevelopment;
