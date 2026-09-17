import { Check, Copy, Mail, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";
import ProfileName from "./ProfileName";
import NowPlaying from "./NowPlaying";
import RotatingRole from "./RotatingRole";
import { useCopyEmail } from "./useCopyEmail";

const ProfileHeader = () => {
  const { isCopied: isEmailCopied, copyEmail } = useCopyEmail(PROFILE.email);
  const { isCopied: isPhoneCopied, copyEmail: copyPhone } = useCopyEmail(PROFILE.phoneHref);

  return (
    <header>
      <div className="flex items-center gap-4 sm:gap-6">
        <img
          src={PROFILE.avatar}
          alt={PROFILE.name}
          width="112"
          height="112"
          fetchPriority="high"
          style={{ backgroundColor: "var(--logo-bg)" }}
          className="size-20 shrink-0 rounded-full object-cover sm:size-28"
        />

        <div className="flex min-w-0 flex-col justify-center gap-2">
          <ProfileName name={PROFILE.name} />
          <div className="flex min-h-[1.5rem] items-center text-sm leading-snug text-[var(--color-secondary-text)] sm:text-base">
            <RotatingRole roles={PROFILE.roles} />
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-[60ch] text-pretty text-[15px] leading-7 text-[var(--color-secondary-text)] sm:text-base">
        {PROFILE.bio}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" aria-label="Contact details">
        <button type="button" onClick={copyEmail} aria-label="Copy email address" className="group flex min-h-7 cursor-pointer items-center gap-1.5 text-left text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--logo-bg)]">
          <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
          <span className="text-[13px] font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-sm">{PROFILE.email}</span>
          <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded text-[var(--color-secondary-text)] opacity-0 transition-all group-hover:text-[var(--color-accent)] group-hover:opacity-100">
            {isEmailCopied ? <Check aria-hidden="true" size={15} className="group-hover:!text-[var(--color-accent)]" /> : <Copy aria-hidden="true" size={15} className="group-hover:!text-[var(--color-accent)]" />}
          </span>
        </button>
        <button type="button" onClick={copyPhone} aria-label="Copy phone number" className="group flex min-h-7 cursor-pointer items-center gap-1.5 text-left text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--logo-bg)]">
          <Phone aria-hidden="true" size={16} strokeWidth={1.8} />
          <span className="text-[13px] font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-sm">{PROFILE.phone}</span>
          <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded text-[var(--color-secondary-text)] opacity-0 transition-all group-hover:text-[var(--color-accent)] group-hover:opacity-100">
            {isPhoneCopied ? <Check aria-hidden="true" size={15} className="group-hover:!text-[var(--color-accent)]" /> : <Copy aria-hidden="true" size={15} className="group-hover:!text-[var(--color-accent)]" />}
          </span>
        </button>
      </div>
      <NowPlaying />
    </header>
  );
};

export default ProfileHeader;
