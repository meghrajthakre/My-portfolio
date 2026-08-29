import { createElement, useEffect, useState } from "react";
import { Check, Clock3, Code2, Copy, GitFork, Mail, MapPin, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";

const ICON_CLASS = "flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-icons-bg)] shadow-[inset_0_0_0_4px_var(--color-card-bg)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--logo-bg)]";

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
        {createElement(icon, { "aria-hidden": true, size: 18, strokeWidth: 1.7 })}
      </span>
      <span className={`min-w-0 truncate ${underlineOnHover ? "group-hover:!text-white group-hover:underline group-hover:underline-offset-4" : ""}`}>{children}</span>
      {trailingIcon && createElement(trailingIcon, {
        "aria-hidden": true,
        size: 15,
        strokeWidth: 1.8,
        className: "shrink-0 text-[var(--color-secondary-text)]",
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
    <div className="mt-4 grid font-mono text-sm font-medium text-[var(--color-text)] sm:grid-cols-2 sm:text-[15px]">
      <div className="flex flex-col gap-3  py-4 ">
        <DetailRow icon={Code2}>Full Stack Developer</DetailRow>
        <DetailRow icon={GitFork}>Open Source Contributor</DetailRow>
        <DetailRow icon={MapPin}>India</DetailRow>
      </div>

      <div className="flex flex-col gap-3  px-4 py-4 ">
        <DetailRow icon={Clock3}>{indiaTime} <span className="text-[var(--color-secondary-text)]">/ IST</span></DetailRow>
        <DetailRow icon={Mail} onClick={onCopyEmail} trailingIcon={isEmailCopied ? Check : Copy} underlineOnHover>
          {PROFILE.email}
        </DetailRow>
        <DetailRow icon={Phone} onClick={onCopyPhone} trailingIcon={isPhoneCopied ? Check : Copy} underlineOnHover>
          {PROFILE.phone}
        </DetailRow>
      </div>
    </div>
  );
};

export default ProfileDetails;
