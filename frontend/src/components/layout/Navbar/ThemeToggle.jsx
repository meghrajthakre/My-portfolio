import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import Tooltip from "../../../common/Tooltip";
import { playClickSound } from "../../../lib/playClickSound";

// One half-turn, fast, ease-out, no bounce. Plain CSS transition on purpose:
// it can't be affected by SVG transform-origin quirks of animation libraries.
const SPIN_MS = 350;
const SPIN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const REVEAL_DELAY = 500;

// A two-tone disc whose colours never change with the theme - only which side
// they sit on does:
//   dark mode  -> LEFT half dark,  RIGHT half white
//   light mode -> LEFT half white, RIGHT half dark   (the exact opposite)
// A ring with a small gap around the disc - flat, no shading - keeps the half
// that matches the page background visible.
const DARK_HALF = "#111";
const LIGHT_HALF = "#fff";
const RING = "#8a8a8a";

const ThemeToggle = ({ isDark, onToggle }) => {
  const reduceMotion = useReducedMotion();

  // The theme we are heading to. It flips the moment a switch starts (not
  // 500ms later when `isDark` changes), and drives the icon angle:
  //   dark  = 0deg   (left dark, right white)
  //   light = 180deg (left white, right dark)
  // The dark half always travels OVER THE TOP:
  //   light -> dark: 180 -> 0   (anticlockwise, right -> top -> left)
  //   dark -> light: 0 -> 180   (clockwise,     left -> top -> right)
  // and it stops where it lands.
  const [headingDark, setHeadingDark] = useState(isDark);
  const timer = useRef(0);
  const target = useRef(isDark); // same value, readable inside timers

  // Every theme switch fires "darkModeToggle" (this button, the T D / T L
  // shortcuts, the search dialog). Spin on the event so the icon reacts
  // instantly.
  useEffect(() => {
    const spin = () => {
      target.current = !target.current;
      setHeadingDark(target.current);
    };
    window.addEventListener("darkModeToggle", spin);
    return () => window.removeEventListener("darkModeToggle", spin);
  }, []);

  // Safety net: if `isDark` changes without the event (system preference,
  // storage sync), snap the icon to the right side.
  useEffect(() => {
    target.current = isDark;
    setHeadingDark(isDark);
  }, [isDark]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = () => {
    playClickSound();

    // The listener above spins the icon (and flips `target`) right away.
    window.dispatchEvent(
      new CustomEvent("darkModeToggle", {
        detail: { x: window.innerWidth, y: 0 },
      })
    );

    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => onToggle(target.current),
      REVEAL_DELAY
    );
  };

  return (
    <Tooltip
      text={`Switch to ${isDark ? "light" : "dark"} mode`}
      placement="bottom"
      fast
      hoverOnly
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className="
          theme-toggle-btn group relative cursor-pointer inline-flex size-9 shrink-0 items-center justify-center
          rounded-md
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-border)]
          sm:size-8
        "
      >
        {/* Soft background: fades in on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-md bg-[var(--color-icons-bg)] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-60 group-focus-visible:opacity-60 motion-reduce:transition-none"
        />

        <span
          aria-hidden="true"
          className="relative flex size-full items-center justify-center transition-transform duration-150 ease-out group-hover:scale-110 group-active:scale-90 motion-reduce:transition-none"
        >
          {/* The rotation lives on this wrapper, not on the <svg>. */}
          <span
            className="flex will-change-transform"
            style={{
              transform: `rotate(${headingDark ? 0 : 180}deg)`,
              transition: reduceMotion
                ? "none"
                : `transform ${SPIN_MS}ms ${SPIN_EASE}`,
            }}
          >
            <svg
              className="size-4"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              // Inline style beats any global CSS (e.g. a `.theme-toggle-btn svg`
              // or `.dark ...` rule) that would rotate the icon a second time.
              style={{ transform: "none", transition: "none" }}
            >
              {/* Inner disc, split down the middle: left half / right half. */}
              <path d="M16 5.5a10.5 10.5 0 0 0 0 21z" fill={DARK_HALF} />
              <path d="M16 5.5a10.5 10.5 0 0 1 0 21z" fill={LIGHT_HALF} />
              {/* Outer ring, with a clear gap before the disc. */}
              <circle cx="16" cy="16" r="14.5" stroke={RING} strokeWidth="2" />
            </svg>
          </span>
        </span>
      </button>
    </Tooltip>
  );
};

export default ThemeToggle;