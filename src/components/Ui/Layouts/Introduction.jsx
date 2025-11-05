import React from "react";
import DownloadButton from "./../DownloadButton";
import GetInTouchButton from "./../GetInTouchButton";
import SocialMediaicons from "./../SocialMediaicons";
import { techStack } from "../../../data/techStack";


const TechBadge = ({ name, icon, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] 
      text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm 
      border border-dashed border-[var(--color-muted)] font-bold 
      transition-all duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
  >
    <img src={icon} alt={`${name} logo`} width="18" height="18" />
    {name}
  </a>
);

const Introduction = () => {
  return (
    <section className="mx-auto max-w-3xl text-left py-14">
      <header>
        {/* Profile / Logo */}
        <div className="inline-block">
          <img
          style={{ backgroundColor: "var(--logo-bg)" }}
            className="h-24 w-24 rounded-full  transition-all duration-300 ease-in-out"
            src="/src/assets/Logo/logo (1).webp"
            alt="Meghraj logo"
            loading="lazy"
          />
        </div>

        {/* Heading */}
        <h1 className="pt-8 text-[34px] text-[var(--color-text)] leading-tight">
          Hi, I’m Meghraj
          <span className="px-2">—</span>
          <span className="text-[var(--color-secondary-text)]">
            I Make Software for the Web.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 pr-2 tracking-tight flex gap-2 flex-wrap items-center text-base md:text-lg text-[var(--color-muted)]">
          My toolkit?&nbsp;&nbsp;&nbsp;
          {techStack.slice(0,6).map((tech) => (
            <React.Fragment key={tech.name}>
              <TechBadge {...tech} />
            </React.Fragment>
          ))}
          and a bit of&nbsp;
        <TechBadge {...techStack[6]}/>
         magic to make things move just right — a developer who believes
          code is just another form of creativity. Mixing logic, motion, and
          design into something users actually enjoy using.
        </p>
      </header>

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-6">
        <DownloadButton />
        <GetInTouchButton />
      </div>

      {/* Social Media */}
      <div className="pt-10">
        <SocialMediaicons />
      </div>
    </section>
  );
};

export default Introduction;
