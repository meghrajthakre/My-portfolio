import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";
import ProfileName from "./ProfileName";
import NowPlaying from "./NowPlaying";
import RotatingRole from "./RotatingRole";
import { useCopyEmail } from "./useCopyEmail";

const ProfileHeader = () => {
  const avatarRef = useRef(null);
  const idleTimer = useRef(null);
  const wakingTimer = useRef(null);
  const reactionTimer = useRef(null);
  const clickTimer = useRef(null);
  const directionRef = useRef("front");
  const sleepingRef = useRef(false);
  const lastPointerPosition = useRef(null);
  const [direction, setDirection] = useState("front");
  const [reaction, setReaction] = useState("");
  const [sleeping, setSleeping] = useState(false);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        sleepingRef.current = true;
        setSleeping(true);
        setWaking(false);
      }, 1800);
    };
    const updateDirection = (event) => {
      const previousPosition = lastPointerPosition.current;
      lastPointerPosition.current = { x: event.clientX, y: event.clientY };
      if (previousPosition && Math.hypot(event.clientX - previousPosition.x, event.clientY - previousPosition.y) < 2) return;

      if (sleepingRef.current) {
        sleepingRef.current = false;
        setWaking(true);
        window.clearTimeout(wakingTimer.current);
        wakingTimer.current = window.setTimeout(() => setWaking(false), 650);
      }
      setSleeping(false);
      resetIdleTimer();
      const rect = avatarRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      if (distance < (directionRef.current === "front" ? 30 : 18)) {
        directionRef.current = "front";
        return setDirection("front");
      }
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      let nextDirection;
      if (angle >= -22.5 && angle < 22.5) nextDirection = "right";
      else if (angle >= 22.5 && angle < 67.5) nextDirection = "down-right";
      else if (angle >= 67.5 && angle < 112.5) nextDirection = "down";
      else if (angle >= 112.5 && angle < 157.5) nextDirection = "down-left";
      else if (angle >= 157.5 || angle < -157.5) nextDirection = "left";
      else if (angle >= -157.5 && angle < -112.5) nextDirection = "up-left";
      else if (angle >= -112.5 && angle < -67.5) nextDirection = "up";
      else nextDirection = "up-right";

      const directionCenters = {
        right: 0,
        "down-right": 45,
        down: 90,
        "down-left": 135,
        left: 180,
        "up-left": -135,
        up: -90,
        "up-right": -45,
      };
      const angleFromCenter = Math.abs(((angle - directionCenters[nextDirection] + 540) % 360) - 180);
      if (directionRef.current === "front" || directionRef.current === nextDirection || angleFromCenter <= 18) {
        directionRef.current = nextDirection;
        setDirection(nextDirection);
      }
    };
    resetIdleTimer();
    window.addEventListener("pointermove", updateDirection, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updateDirection);
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(wakingTimer.current);
    };
  }, []);

  useEffect(() => () => {
    window.clearTimeout(reactionTimer.current);
    window.clearTimeout(clickTimer.current);
    window.clearTimeout(wakingTimer.current);
  }, []);

  const handleAvatarClick = () => {
    window.clearTimeout(idleTimer.current);
    if (sleepingRef.current) {
      sleepingRef.current = false;
      setWaking(true);
      window.clearTimeout(wakingTimer.current);
      wakingTimer.current = window.setTimeout(() => setWaking(false), 650);
    }
    setSleeping(false);
    idleTimer.current = window.setTimeout(() => {
      sleepingRef.current = true;
      setSleeping(true);
      setWaking(false);
    }, 1800);
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      window.clearTimeout(reactionTimer.current);
      setReaction("love");
      reactionTimer.current = window.setTimeout(() => setReaction(""), 1000);
      return;
    }

    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      setReaction("happy");
      window.clearTimeout(reactionTimer.current);
      reactionTimer.current = window.setTimeout(() => setReaction(""), 800);
    }, 220);
  };

  const { isCopied: isEmailCopied, copyEmail } = useCopyEmail(PROFILE.email);
  const { isCopied: isPhoneCopied, copyEmail: copyPhone } = useCopyEmail(PROFILE.phoneHref);
  const displayedDirection = sleeping ? "sleep" : direction;

  return (
    <header>
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          ref={avatarRef}
          type="button"
          onClick={handleAvatarClick}
          aria-label={sleeping ? `${PROFILE.name}'s avatar is sleeping. Move the pointer to wake it.` : `${PROFILE.name}'s interactive avatar. Move the pointer to change its gaze; click for a happy face and double click for hearts.`}
          className="profile-avatar relative size-24 shrink-0 overflow-hidden sm:size-34"
        >
          <span className={`profile-avatar-sprite profile-avatar-${displayedDirection}${waking ? " profile-avatar-awake profile-avatar-waking" : reaction ? ` profile-avatar-${reaction}` : ""}`} role="img" aria-label={sleeping ? "Sleeping" : waking ? "Waking up" : reaction === "love" ? "Love-struck" : reaction === "happy" ? "Happy" : PROFILE.name} />
          {sleeping && (
            <span aria-hidden="true" className="profile-avatar-zzz">
              <span>Z</span><span>z</span><span>z</span><span>z</span>
            </span>
          )}
          {reaction === "love" && (
            <span aria-hidden="true" className="profile-avatar-hearts">
              <span>&hearts;</span><span>&hearts;</span><span>&hearts;</span>
              <span>&hearts;</span><span>&hearts;</span><span>&hearts;</span>
            </span>
          )}
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
