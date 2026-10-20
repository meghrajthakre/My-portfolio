import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";
import ProfileName from "./ProfileName";
import NowPlaying from "./NowPlaying";
import RotatingRole from "./RotatingRole";
import { useCopyEmail } from "./useCopyEmail";

const ProfileHeader = () => {
  const avatarRef = useRef(null);
  const reactionTimer = useRef(null);
  const clickTimer = useRef(null);
  const [direction, setDirection] = useState("front");
  const [reaction, setReaction] = useState("");

  useEffect(() => {
    const updateDirection = (event) => {
      const rect = avatarRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) < 24) return setDirection("front");
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle >= -22.5 && angle < 22.5) setDirection("right");
      else if (angle >= 22.5 && angle < 67.5) setDirection("down-right");
      else if (angle >= 67.5 && angle < 112.5) setDirection("down");
      else if (angle >= 112.5 && angle < 157.5) setDirection("down-left");
      else if (angle >= 157.5 || angle < -157.5) setDirection("left");
      else if (angle >= -157.5 && angle < -112.5) setDirection("up-left");
      else if (angle >= -112.5 && angle < -67.5) setDirection("up");
      else setDirection("up-right");
    };
    window.addEventListener("pointermove", updateDirection, { passive: true });
    return () => window.removeEventListener("pointermove", updateDirection);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(reactionTimer.current);
    window.clearTimeout(clickTimer.current);
  }, []);

  const handleAvatarClick = () => {
    window.clearTimeout(clickTimer.current);
    if (reaction === "happy") {
      setReaction("love");
      window.clearTimeout(reactionTimer.current);
      reactionTimer.current = window.setTimeout(() => setReaction(""), 1000);
      return;
    }
    setReaction("happy");
    reactionTimer.current = window.setTimeout(() => setReaction(""), 800);
    clickTimer.current = window.setTimeout(() => setReaction(""), 800);
  };

  const { isCopied: isEmailCopied, copyEmail } = useCopyEmail(PROFILE.email);
  const { isCopied: isPhoneCopied, copyEmail: copyPhone } = useCopyEmail(PROFILE.phoneHref);

  return (
    <header>
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          ref={avatarRef}
          type="button"
          onClick={handleAvatarClick}
          aria-label={`${PROFILE.name}'s interactive avatar. Move the pointer to change its gaze; click for a happy face and double click for hearts.`}
          className="profile-avatar relative size-20 shrink-0 overflow-hidden rounded-full sm:size-28"
        >
          <span className={`profile-avatar-sprite profile-avatar-${direction}${reaction ? ` profile-avatar-${reaction}` : ""}`} role="img" aria-label={reaction === "love" ? "Love-struck" : reaction === "happy" ? "Happy" : PROFILE.name} />
          {reaction === "love" && <span aria-hidden="true" className="profile-avatar-hearts">♥ ♥ ♥</span>}
        </button>

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
