import { PROFILE } from "./profileContent";
import ProfileDetails from "./ProfileDetails";
import ProfileName from "./ProfileName";
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

      <ProfileDetails
        onCopyEmail={copyEmail}
        isEmailCopied={isEmailCopied}
        onCopyPhone={copyPhone}
        isPhoneCopied={isPhoneCopied}
      />
    </header>
  );
};

export default ProfileHeader;
