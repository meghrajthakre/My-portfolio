import { Check, Copy, Mail } from "lucide-react";
import { PROFILE } from "./profileContent";
import ProfileName from "./ProfileName";
import RotatingRole from "./RotatingRole";
import { useCopyEmail } from "./useCopyEmail";

const ProfileHeader = () => {
  const { isCopied, copyEmail } = useCopyEmail(PROFILE.email);

  return (
    <header>
      <div className="flex items-center gap-4 sm:gap-5">
        <img
          src={PROFILE.avatar}
          alt={PROFILE.name}
          width="112"
          height="112"
          fetchPriority="high"
          style={{ backgroundColor: "var(--logo-bg)" }}
          className="size-20 shrink-0 rounded-full object-cover sm:size-28"
        />

        <div className="min-w-0">
          <ProfileName name={PROFILE.name} />
          <div className="mt-1.5 flex items-center text-sm text-[var(--color-secondary-text)] sm:text-lg">
            <RotatingRole roles={PROFILE.roles} />
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
        {PROFILE.bio}
      </p>

      <button
        type="button"
        onClick={copyEmail}
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-sm text-[var(--color-secondary-text)] transition-all duration-200 hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)] active:scale-[0.98]"
        aria-label={isCopied ? "Email copied" : "Copy email address"}
      >
        <Mail aria-hidden="true" size={15} />
        <span>{PROFILE.email}</span>
        <span className="ml-1 border-l border-[var(--color-border)] pl-2">
          {isCopied ? <Check aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={14} />}
        </span>
      </button>
    </header>
  );
};

export default ProfileHeader;
