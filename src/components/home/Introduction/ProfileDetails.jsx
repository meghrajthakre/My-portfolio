import { createElement, useEffect, useState } from "react";
import { Check, Clock3, Code2, Copy, GitFork, Mail, MapPin, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";
import { StaggerItem, StaggerReveal } from "../../Animation/StaggerReveal";

const ICON_CLASS = "profile-icon-tile flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--profile-icon-color)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--logo-bg)]";

const useIndiaTime = () => {
  const getTime = () => new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(new Date())
    .map((part) => part.type === "dayPeriod" ? part.value.toUpperCase() : part.value)
    .join("");

  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTime()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
};

const DetailRow = ({ icon, children, onClick, trailingIcon, underlineOnHover = false }) => {
  const content = (
    <>
      <span className={ICON_CLASS}>
        {createElement(icon, { "aria-hidden": true, size: 16, strokeWidth: 1.7 })}
      </span>
      <span className={`min-w-0 truncate ${underlineOnHover ? "group-hover:!text-[var(--color-accent)] group-hover:underline group-hover:underline-offset-4" : ""}`}>{children}</span>
      {trailingIcon && createElement(trailingIcon, {
        "aria-hidden": true,
        size: 15,
        strokeWidth: 1.8,
        className: "shrink-0 text-[var(--color-secondary-text)] transition-all duration-200 group-hover:scale-110 group-hover:text-[var(--color-accent)]",
      })}
    </>
  );

  return onClick ? (
    <button type="button" onClick={onClick} className="group flex w-full cursor-pointer items-center gap-4 text-left">
      {content}
    </button>
  ) : (
    <div className="group flex items-center gap-4">{content}</div>
  );
};

const ProfileDetails = ({ onCopyEmail, isEmailCopied, onCopyPhone, isPhoneCopied }) => {
  const indiaTime = useIndiaTime();

  return (
    <StaggerReveal className="mt-4 grid font-mono text-sm font-medium text-[var(--color-text)] sm:grid-cols-2 sm:text-[15px]" delay={0.18}>
      <div className="hidden flex-col gap-3 py-4 sm:flex">
        <StaggerItem><DetailRow icon={Code2}>Full Stack Developer</DetailRow></StaggerItem>
        <StaggerItem><DetailRow icon={GitFork}>Open Source Contributor</DetailRow></StaggerItem>
        <StaggerItem><DetailRow icon={MapPin}>India</DetailRow></StaggerItem>
      </div>

      <div className="flex flex-col gap-3  px-4 py-4 ">
        <div className="hidden sm:block">
          <StaggerItem><DetailRow icon={Clock3}>{indiaTime} <span className="text-[var(--color-secondary-text)]">/ IST</span></DetailRow></StaggerItem>
        </div>
        <StaggerItem>
          <DetailRow icon={Mail} onClick={onCopyEmail} trailingIcon={isEmailCopied ? Check : Copy} underlineOnHover>
            {PROFILE.email}
          </DetailRow>
        </StaggerItem>
        <StaggerItem>
          <DetailRow icon={Phone} onClick={onCopyPhone} trailingIcon={isPhoneCopied ? Check : Copy} underlineOnHover>
            {PROFILE.phone}
          </DetailRow>
        </StaggerItem>
      </div>
    </StaggerReveal>
  );
};

export default ProfileDetails;
