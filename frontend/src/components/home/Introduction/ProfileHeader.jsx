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
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" aria-label="Contact details">
        <div className="group flex items-center gap-2 text-[var(--color-secondary-text)]">
          <Mail aria-hidden="true" size={15} strokeWidth={1.8} />
          <span className="font-medium text-[var(--color-text)]">{PROFILE.email}</span>
          <button type="button" onClick={copyEmail} aria-label="Copy email address" title="Copy email" className="inline-flex size-6 items-center justify-center rounded text-[var(--color-secondary-text)] opacity-0 transition-all hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)] focus-visible:opacity-100 group-hover:opacity-100">
            {isEmailCopied ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}
          </button>
        </div>
        <div className="group flex items-center gap-2 text-[var(--color-secondary-text)]">
          <Phone aria-hidden="true" size={15} strokeWidth={1.8} />
          <span className="font-medium text-[var(--color-text)]">{PROFILE.phone}</span>
          <button type="button" onClick={copyPhone} aria-label="Copy phone number" title="Copy phone number" className="inline-flex size-6 items-center justify-center rounded text-[var(--color-secondary-text)] opacity-0 transition-all hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)] focus-visible:opacity-100 group-hover:opacity-100">
            {isPhoneCopied ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}
          </button>
        </div>
      </div>
      <NowPlaying />
    </header>
  );
};

export default ProfileHeader;
