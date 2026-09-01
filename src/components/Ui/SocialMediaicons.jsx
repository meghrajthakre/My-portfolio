import React from "react";
import { FaDiscord, FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Tooltip from "../../common/Tooltip";
import { StaggerItem, StaggerReveal } from "../Animation/StaggerReveal";

const SocialMediaicons = () => {
  const iconClass = `
    w-[24px] h-[24px]
    text-[var(--profile-icon-color)]
    transition-all duration-200 ease-out
    group-hover:-translate-y-0.5 group-hover:scale-110
    group-hover:text-[var(--profile-icon-hover)]
  `;

  const icons = [
    {
      href: "https://x.com/meghraj_thakre1",
      label: "Twitter / X",
      svg: <FaXTwitter aria-hidden="true" className={iconClass} />,
    },
    {
      href: "https://www.linkedin.com/in/meghraj-thakre-01a09b23a/",
      label: "LinkedIn",
      svg: <FaLinkedin aria-hidden="true" className={iconClass} />,
    },
    {
      href: "https://github.com/meghrajthakre",
      label: "GitHub",
      svg: <FaGithub aria-hidden="true" className={iconClass} />,
    },
    {
      href: "https://www.instagram.com/meghraj_thakre/",
      label: "Instagram",
      svg: <FaInstagram aria-hidden="true" className={iconClass} />,
    },
    {
      href: "https://discord.com/app",
      label: "Discord — meghraj2285",
      svg: <FaDiscord aria-hidden="true" className={iconClass} />,
    },
    {
      href: "mailto:meghrajthakre444@gmail.com",
      label: "Gmail",
      svg: <FaEnvelope aria-hidden="true" className={iconClass} />,
    },
  ];

  return (
    <StaggerReveal className="flex flex-nowrap items-center gap-5" delay={0.12}>
      {icons.map(({ href, label, svg }) => (
        <StaggerItem key={label}>
          <Tooltip text={label}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="flex items-center justify-center outline-none focus-visible:text-[var(--profile-icon-hover)]"
            >
              {svg}
            </a>
          </Tooltip>
        </StaggerItem>
      ))}
    </StaggerReveal>

  );

};

export default SocialMediaicons;
