import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { PROFILE } from "./profileContent";
import ProfileName from "./ProfileName";
import NowPlaying from "./NowPlaying";
import RotatingRole from "./RotatingRole";
import { useCopyEmail } from "./useCopyEmail";

// Pick a theme: "garden" | "music" | "cosmic" | "autumn" | "festive" | "dev" | "random"
const ACTIVE_THEME = "random";

// items: [glyph, floatiness 0-1 (1 = drifts like a leaf, 0 = drops like a stone), glow?]
const THEMES = {
  garden: {
    petalShare: 0.22,
    colors: ["#ffb7c5", "#ff8fab", "#ffd6a5", "#e0aaff", "#fff1a8", "#c1f0d1"],
    items: [["🪷", 0.4], ["🪻", 0.4], ["🏵️", 0.4], ["💮", 0.55], ["🌸", 0.55], ["🌼", 0.45], ["🌺", 0.4], ["🌻", 0.3], ["🦋", 0.95], ["🍃", 1]],
  },
  music: {
    petalShare: 0,
    colors: [],
    items: [["🎵", 0.7], ["🎶", 0.7], ["🎧", 0.2], ["🎸", 0.15], ["🥁", 0.15], ["🎹", 0.15], ["🎷", 0.15], ["🎻", 0.15]],
  },
  cosmic: {
    petalShare: 0.18,
    colors: ["#fff3b0", "#ffd166", "#cdb4ff", "#ffffff"],
    items: [["⭐", 0.5, true], ["🌟", 0.5, true], ["✨", 0.8, true], ["💫", 0.7, true], ["🌙", 0.35], ["🪐", 0.2], ["☄️", 0.3]],
  },
  autumn: {
    petalShare: 0.25,
    colors: ["#d9480f", "#f08c00", "#c2255c", "#a05a2c", "#e8a33d"],
    items: [["🍁", 0.9], ["🍂", 0.95], ["🍃", 1], ["🌰", 0.1], ["🍄", 0.15], ["🌾", 0.7]],
  },
  festive: {
    petalShare: 0.3,
    colors: ["#ff9f1c", "#ff4d6d", "#c77dff", "#ffd60a", "#2ec4b6"],
    items: [["🪔", 0.2], ["🪷", 0.4], ["🏵️", 0.4], ["✨", 0.8, true], ["🎆", 0.3], ["🧡", 0.4], ["🪁", 0.5]],
  },
  dev: {
    petalShare: 0,
    colors: [],
    items: [["💻", 0.15], ["🐛", 0.3], ["🐞", 0.35], ["⚡", 0.3, true], ["🚀", 0.2], ["☕", 0.2], ["⌨️", 0.15], ["🧩", 0.2]],
  },
};

const FLOWER_CSS = `
.flower-fx {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

/* Outer layer: curtain from the navbar, fall, squash-and-bounce on the floor, rest, fade. */
.flower-fx-item {
  position: absolute;
  top: 0;
  left: 0;
  font-size: var(--size);
  line-height: 1;
  opacity: 0;
  will-change: transform, opacity;
  animation: flower-fx-flight var(--dur) var(--delay) linear both;
}

/* Inner layer: sways and flips in 3D while falling, then settles flat once it lands. */
.flower-fx-item > span {
  display: block;
  animation: flower-fx-sway var(--dur) var(--delay) ease-in-out both;
}

.flower-fx-glyph {
  filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.18));
}

.flower-fx-glow {
  filter: drop-shadow(0 0 6px rgb(255 214 102 / 0.95)) drop-shadow(0 0 14px rgb(255 190 80 / 0.5));
}

/* Pure-CSS petal: no emoji, so it looks the same on every device. */
.flower-fx-petal {
  width: 0.7em;
  height: 0.95em;
  border-radius: 100% 0 100% 0;
  background: radial-gradient(circle at 30% 25%, #fff9 0, transparent 45%), var(--petal);
  box-shadow: inset -2px -2px 4px rgb(0 0 0 / 0.08);
}

@keyframes flower-fx-flight {
  0% {
    opacity: 0;
    transform: translate3d(var(--sx), var(--sy), 0) scale(0.2) rotate(0deg);
    animation-timing-function: cubic-bezier(0.15, 0.7, 0.3, 1);
  }
  6% { opacity: var(--opacity); }
  16% {
    opacity: var(--opacity);
    transform: translate3d(calc(var(--sx) + var(--bx)), calc(var(--sy) + var(--by)), 0) scale(1) rotate(calc(var(--spin) * 0.15));
    animation-timing-function: cubic-bezier(0.4, 0, 0.85, 0.55);
  }
  /* first touch: squash */
  72% {
    opacity: var(--opacity);
    transform: translate3d(calc(var(--sx) + var(--mx)), calc(var(--floor) - var(--size) - var(--rest)), 0) scale(1.15, 0.8) rotate(calc(var(--spin) * 0.85));
    animation-timing-function: cubic-bezier(0.2, 0.7, 0.4, 1);
  }
  /* hop up, stretched */
  79% {
    transform: translate3d(calc(var(--sx) + (var(--mx) * 3 + var(--ex)) / 4), calc(var(--floor) - var(--size) - var(--rest) - var(--hop)), 0) scale(0.94, 1.08) rotate(calc(var(--spin) * 0.93));
    animation-timing-function: cubic-bezier(0.4, 0, 0.85, 0.55);
  }
  /* second touch */
  85% {
    transform: translate3d(calc(var(--sx) + (var(--mx) + var(--ex)) / 2), calc(var(--floor) - var(--size) - var(--rest)), 0) scale(1.08, 0.9) rotate(calc(var(--spin) * 0.98));
    animation-timing-function: cubic-bezier(0.2, 0.7, 0.4, 1);
  }
  /* tiny final hop */
  89% {
    transform: translate3d(calc(var(--sx) + var(--ex)), calc(var(--floor) - var(--size) - var(--rest) - var(--hop) * 0.25), 0) scale(1, 1) rotate(var(--spin));
    animation-timing-function: cubic-bezier(0.4, 0, 0.85, 0.55);
  }
  /* rest on the floor, then fade away */
  93% {
    opacity: var(--opacity);
    transform: translate3d(calc(var(--sx) + var(--ex)), calc(var(--floor) - var(--size) - var(--rest)), 0) scale(1.04, 0.95) rotate(var(--spin));
  }
  100% {
    opacity: 0;
    transform: translate3d(calc(var(--sx) + var(--ex)), calc(var(--floor) - var(--size) - var(--rest)), 0) scale(1) rotate(var(--spin));
  }
}

@keyframes flower-fx-sway {
  0%, 16% { transform: perspective(320px) translateX(0) rotateY(0deg) rotateZ(0deg); }
  28% { transform: perspective(320px) translateX(calc(var(--sway) * -1)) rotateY(-65deg) rotateZ(-14deg); }
  40% { transform: perspective(320px) translateX(var(--sway)) rotateY(65deg) rotateZ(14deg); }
  52% { transform: perspective(320px) translateX(calc(var(--sway) * -0.8)) rotateY(-55deg) rotateZ(-10deg); }
  64% { transform: perspective(320px) translateX(calc(var(--sway) * 0.5)) rotateY(40deg) rotateZ(8deg); }
  74%, 100% { transform: perspective(320px) translateX(0) rotateY(0deg) rotateZ(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .flower-fx-item { animation: flower-fx-fade 1.6s var(--delay) linear both; }
  .flower-fx-item > span { animation: none; }
  @keyframes flower-fx-fade {
    0%, 100% { opacity: 0; transform: translate3d(var(--sx), var(--sy), 0); }
    30%, 70% { opacity: var(--opacity); transform: translate3d(var(--sx), var(--sy), 0); }
  }
}
`;

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// A curtain of particles that sweeps across the navbar, falls with a bit of wind, bounces and fades.
const createFlowerShower = () => {
  const width = window.innerWidth;
  const theme = THEMES[ACTIVE_THEME] ?? THEMES[pick(Object.keys(THEMES))];
  const count = width < 640 ? 36 : 64;
  const wind = rand(-110, 110); // one shared lean so the whole shower feels like one gust
  const sweepFromLeft = Math.random() < 0.5;
  return Array.from({ length: count }, (_, index) => {
    const depth = Math.random(); // 0 = far/small/faint, 1 = close/big/bold
    const isPetal = theme.petalShare > 0 && Math.random() < theme.petalShare;
    const [glyph, floaty, glow] = isPetal ? ["", 0.95, false] : pick(theme.items);
    const size = 13 + depth * 24;
    const sx = rand(0, Math.max(width - size, 1));
    const targetX = clamp(sx + wind * rand(0.4, 1) + rand(-80, 80), 0, Math.max(width - size, 1));
    const ex = targetX - sx;
    const wave = sx / width;
    return {
      id: `${Date.now()}-${index}`,
      isPetal,
      glyph,
      glow,
      color: theme.colors.length ? pick(theme.colors) : "#ffffff",
      sx,
      sy: rand(58, 96),
      bx: rand(-40, 40),
      by: rand(14, 60),
      mx: ex * rand(0.8, 0.95),
      ex,
      hop: rand(14, 40) * (1 - floaty * 0.65),
      rest: rand(0, 20),
      spin: rand(-540, 540) * (1 - floaty * 0.4),
      sway: 10 + floaty * 36,
      delay: (sweepFromLeft ? wave : 1 - wave) * 0.9 + rand(0, 0.45),
      duration: rand(4.6, 5.8) + floaty * 1.1,
      size,
      opacity: 0.6 + depth * 0.4,
      blur: depth < 0.15 ? 1.5 : 0,
    };
  });
};

const ProfileHeader = () => {
  const avatarRef = useRef(null);
  const idleTimer = useRef(null);
  const wakingTimer = useRef(null);
  const reactionTimer = useRef(null);
  const clickTimer = useRef(null);
  const flowerTimer = useRef(null);
  const directionRef = useRef("front");
  const sleepingRef = useRef(false);
  const lastPointerPosition = useRef(null);
  const [direction, setDirection] = useState("front");
  const [reaction, setReaction] = useState("");
  const [sleeping, setSleeping] = useState(false);
  const [waking, setWaking] = useState(false);
  const [flowerShower, setFlowerShower] = useState([]);

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
      // Browsers can dispatch a zero-delta pointer event when a page gains focus.
      // Treat only physical cursor movement as activity so loading the site won't wake the avatar.
      if (Number.isFinite(event.movementX) && Number.isFinite(event.movementY) && event.movementX === 0 && event.movementY === 0) return;
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
    window.clearTimeout(flowerTimer.current);
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
    setFlowerShower(createFlowerShower());
    window.clearTimeout(flowerTimer.current);
    flowerTimer.current = window.setTimeout(() => setFlowerShower([]), 9500);
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
          aria-label={sleeping ? `${PROFILE.name}'s avatar is sleeping. Move the pointer to wake it.` : `${PROFILE.name}'s interactive avatar. Move the pointer to change its gaze; click for a happy face and double click for a full-screen flower shower.`}
          className="profile-avatar relative size-24 shrink-0 overflow-hidden sm:size-34"
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
      {flowerShower.length > 0 && createPortal(
        <div aria-hidden="true" className="flower-fx" style={{ "--floor": `${window.innerHeight}px` }}>
          <style>{FLOWER_CSS}</style>
          {flowerShower.map((f) => (
            <span
              key={f.id}
              className="flower-fx-item"
              style={{
                "--sx": `${f.sx}px`,
                "--sy": `${f.sy}px`,
                "--bx": `${f.bx}px`,
                "--by": `${f.by}px`,
                "--mx": `${f.mx}px`,
                "--ex": `${f.ex}px`,
                "--hop": `${f.hop}px`,
                "--rest": `${f.rest}px`,
                "--spin": `${f.spin}deg`,
                "--sway": `${f.sway}px`,
                "--size": `${f.size}px`,
                "--opacity": f.opacity,
                "--petal": f.color,
                "--dur": `${f.duration}s`,
                "--delay": `${f.delay}s`,
                filter: f.blur ? `blur(${f.blur}px)` : undefined,
              }}
            >
              <span className={f.isPetal ? "flower-fx-petal" : f.glow ? "flower-fx-glyph flower-fx-glow" : "flower-fx-glyph"}>{f.glyph}</span>
            </span>
          ))}
        </div>,
        document.body,
      )}
    </header>
  );
};

export default ProfileHeader;
