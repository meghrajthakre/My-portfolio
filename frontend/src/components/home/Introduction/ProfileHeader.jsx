import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";
import ProfileName from "./ProfileName";
import NowPlaying from "./NowPlaying";
import RotatingRole from "./RotatingRole";
import { useCopyEmail } from "./useCopyEmail";
import { ParticleShower } from "./ParticleShower";
import { chooseTheme } from "./profileFlowerThemes.js";
import "./ProfileHeader.css";

const IDLE_MS = 1800;
const WAKE_MS = 650;

// Screen-space angle (y points down) of each gaze sprite's centre, in degrees.
const SECTORS = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"];
const SECTOR_SIZE = 45;
// How far past a sector boundary the cursor must go before the gaze flips.
const HYSTERESIS_DEG = 7;
// Minimum real cursor travel (px) that counts as activity.
const ACTIVITY_PX = 2;

const SPRITE_NAMES = ["front", ...SECTORS, "happy", "love", "sleep", "awake"];

/**
 * Pure gaze resolver. Given the cursor offset from the avatar centre, returns the
 * sprite direction. A dead-zone around the avatar keeps it facing front, and
 * hysteresis on the sector boundaries stops it flickering between two sprites
 * when the cursor sits near a boundary.
 */
function resolveGaze(dx, dy, previous, deadZone) {
  const distance = Math.hypot(dx, dy);
  // Wider zone to leave "front", narrower to return to it (hysteresis on radius too).
  if (distance < (previous === "front" ? deadZone : deadZone * 0.65)) return "front";

  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

  const previousIndex = SECTORS.indexOf(previous);
  if (previousIndex !== -1) {
    const diff = Math.abs(((angle - previousIndex * SECTOR_SIZE + 540) % 360) - 180);
    if (diff <= SECTOR_SIZE / 2 + HYSTERESIS_DEG) return previous;
  }
  return SECTORS[Math.round(angle / SECTOR_SIZE) % SECTORS.length];
}

const ProfileHeader = () => {
  const avatarRef = useRef(null);
  const idleTimer = useRef(null);
  const wakingTimer = useRef(null);
  const reactionTimer = useRef(null);
  const clickTimer = useRef(null);
  const frameRef = useRef(0);
  const directionRef = useRef("front");
  const sleepingRef = useRef(false);
  const pointerRef = useRef(null); // latest cursor position, used for gaze
  const activityAnchor = useRef(null); // last position that counted as "real" movement
  const [direction, setDirection] = useState("front");
  const [reaction, setReaction] = useState("");
  const [sleeping, setSleeping] = useState(false);
  const [waking, setWaking] = useState(false);
  const [shower, setShower] = useState(null);

  const applyDirection = useCallback((next) => {
    if (directionRef.current === next) return;
    directionRef.current = next;
    setDirection(next);
  }, []);

  const goToSleep = useCallback(() => {
    sleepingRef.current = true;
    setSleeping(true);
    setWaking(false);
  }, []);

  const scheduleSleep = useCallback(() => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(goToSleep, IDLE_MS);
  }, [goToSleep]);

  const wakeUp = useCallback(() => {
    if (sleepingRef.current) {
      sleepingRef.current = false;
      setWaking(true);
      window.clearTimeout(wakingTimer.current);
      wakingTimer.current = window.setTimeout(() => setWaking(false), WAKE_MS);
    }
    setSleeping(false);
  }, []);

  // Recompute gaze from the last known cursor position. Runs at most once per frame
  // and also after scroll/resize, when the avatar moves under a stationary cursor.
  const updateGaze = useCallback(() => {
    frameRef.current = 0;
    const pointer = pointerRef.current;
    const rect = avatarRef.current?.getBoundingClientRect();
    if (!pointer || !rect) return;
    const dx = pointer.x - (rect.left + rect.width / 2);
    const dy = pointer.y - (rect.top + rect.height / 2);
    const deadZone = Math.max(24, rect.width * 0.35);
    applyDirection(resolveGaze(dx, dy, directionRef.current, deadZone));
  }, [applyDirection]);

  const requestGazeUpdate = useCallback(() => {
    if (!frameRef.current) frameRef.current = window.requestAnimationFrame(updateGaze);
  }, [updateGaze]);

  // Preload every sprite so the first gaze change never flashes an empty frame.
  useEffect(() => {
    const images = SPRITE_NAMES.map((name) => {
      const img = new Image();
      img.src = `/Logo/streamer-${name}.png`;
      return img;
    });
    return () => images.forEach((img) => { img.src = ""; });
  }, []);

  useEffect(() => {
    const handleAvatarCommand = (event) => {
      const { command } = event.detail ?? {};
      if (command === "sleep") {
        window.clearTimeout(idleTimer.current);
        window.clearTimeout(wakingTimer.current);
        goToSleep();
        setReaction("");
      } else if (command === "wake") {
        sleepingRef.current = false;
        setSleeping(false);
        setWaking(true);
        window.clearTimeout(wakingTimer.current);
        wakingTimer.current = window.setTimeout(() => setWaking(false), WAKE_MS);
        scheduleSleep();
      } else if (command === "happy") {
        sleepingRef.current = false;
        setSleeping(false);
        setWaking(false);
        setReaction("happy");
        window.clearTimeout(reactionTimer.current);
        reactionTimer.current = window.setTimeout(() => setReaction(""), 800);
        scheduleSleep();
      }
    };

    const handlePointerMove = (event) => {
      const position = { x: event.clientX, y: event.clientY };
      pointerRef.current = position;

      // Browsers can dispatch a zero-delta pointer event when a page gains focus.
      // Only real cursor movement counts as activity, so loading the site won't wake the avatar.
      if (Number.isFinite(event.movementX) && Number.isFinite(event.movementY) && event.movementX === 0 && event.movementY === 0) return;

      // Measure against the last *counted* position so slow drags still accumulate
      // instead of being discarded 1px at a time.
      const anchor = activityAnchor.current;
      if (anchor && Math.hypot(position.x - anchor.x, position.y - anchor.y) < ACTIVITY_PX) return;
      activityAnchor.current = position;

      wakeUp();
      scheduleSleep();
      requestGazeUpdate();
    };

    // Cursor left the page or the window lost focus: look straight ahead.
    const handleLeave = () => {
      pointerRef.current = null;
      activityAnchor.current = null;
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      applyDirection("front");
    };
    const handleMouseOut = (event) => {
      if (!event.relatedTarget) handleLeave();
    };

    scheduleSleep();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", requestGazeUpdate, { passive: true });
    window.addEventListener("resize", requestGazeUpdate, { passive: true });
    window.addEventListener("blur", handleLeave);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("portfolio-avatar-command", handleAvatarCommand);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", requestGazeUpdate);
      window.removeEventListener("resize", requestGazeUpdate);
      window.removeEventListener("blur", handleLeave);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("portfolio-avatar-command", handleAvatarCommand);
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(wakingTimer.current);
    };
  }, [applyDirection, goToSleep, requestGazeUpdate, scheduleSleep, wakeUp]);

  useEffect(() => () => {
    window.clearTimeout(reactionTimer.current);
    window.clearTimeout(clickTimer.current);
    window.clearTimeout(wakingTimer.current);
  }, []);

  const handleAvatarClick = () => {
    wakeUp();
    scheduleSleep();
    window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      setReaction("happy");
      window.clearTimeout(reactionTimer.current);
      reactionTimer.current = window.setTimeout(() => setReaction(""), 800);
    }, 380);
  };

  const handleAvatarDoubleClick = () => {
    window.clearTimeout(clickTimer.current);
    clickTimer.current = null;
    window.clearTimeout(reactionTimer.current);
    setReaction("love");
    reactionTimer.current = window.setTimeout(() => setReaction(""), 1000);

    const rect = avatarRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: 120 };
    setShower({ id: Date.now(), theme: chooseTheme(), origin });
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
          onDoubleClick={handleAvatarDoubleClick}
          aria-label={sleeping ? `${PROFILE.name}'s avatar is sleeping. Move the pointer to wake it.` : `${PROFILE.name}'s interactive avatar. Move the pointer to change its gaze; click for a happy face and double click for a full-screen particle shower.`}
          className="profile-avatar relative size-20 shrink-0 sm:size-34"
        >
          <span className={`profile-avatar-sprite profile-avatar-${displayedDirection}${waking ? " profile-avatar-awake" : reaction ? ` profile-avatar-${reaction}` : ""}`} role="img" aria-label={sleeping ? "Sleeping" : waking ? "Waking up" : reaction === "love" ? "Love-struck" : reaction === "happy" ? "Happy" : PROFILE.name} />
          {sleeping && (
            <span aria-hidden="true" className="profile-avatar-zzz">
              <span>Z</span><span>z</span><span>z</span><span>z</span>
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
          <Mail aria-hidden="true" size={14} strokeWidth={1.8} />
          <span className="text-[13px] font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-sm">{PROFILE.email}</span>
          <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded text-[var(--color-secondary-text)] opacity-0 transition-all group-hover:text-[var(--color-accent)] group-hover:opacity-100">
            {isEmailCopied ? <Check aria-hidden="true" size={13} className="group-hover:!text-[var(--color-accent)]" /> : <Copy aria-hidden="true" size={13} className="group-hover:!text-[var(--color-accent)]" />}
          </span>
        </button>
        <button type="button" onClick={copyPhone} aria-label="Copy phone number" className="group flex min-h-7 cursor-pointer items-center gap-1.5 text-left text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--logo-bg)]">
          <Phone aria-hidden="true" size={14} strokeWidth={1.8} />
          <span className="text-[13px] font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] sm:text-sm">{PROFILE.phone}</span>
          <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded text-[var(--color-secondary-text)] opacity-0 transition-all group-hover:text-[var(--color-accent)] group-hover:opacity-100">
            {isPhoneCopied ? <Check aria-hidden="true" size={13} className="group-hover:!text-[var(--color-accent)]" /> : <Copy aria-hidden="true" size={13} className="group-hover:!text-[var(--color-accent)]" />}
          </span>
        </button>
      </div>
      <NowPlaying />
      {shower && (
        <ParticleShower
          key={shower.id}
          theme={shower.theme}
          origin={shower.origin}
          onDone={() => setShower(null)}
        />
      )}
    </header>
  );
};

export default ProfileHeader;