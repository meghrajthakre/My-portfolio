import { Moon, Sun } from "lucide-react";
import { playClickSound } from "../../../lib/playClickSound";

// Bulb flicker (on -> off -> on), bina shadow ke.
// Ab flicker zyada natural hai: irregular dips, aur end me fully on settle hota hai.
const bulbCss = `
  @keyframes tt-bulb {
    0%   { opacity: 0; }
    12%  { opacity: 1; }
    24%  { opacity: 0.15; }
    38%  { opacity: 1; }
    52%  { opacity: 0.05; }
    62%  { opacity: 0.85; }
    72%  { opacity: 0.3; }
    100% { opacity: 1; }
  }
  .group:hover .tt-flicker,
  .group:focus-visible .tt-flicker {
    animation: tt-bulb 420ms linear forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .group:hover .tt-flicker,
    .group:focus-visible .tt-flicker { animation: none; }
  }
`;

// Outer span:
// - hover pe: turant apni jagah pe aata hai (duration-0) aur flicker chalta hai
// - hover hatne pe: center (icon) ki taraf piche slide hota hai, fade slide se thoda pehle khatam hota hai
const outer =
  "pointer-events-none absolute size-2 opacity-0 " +
  "[transition-property:transform,translate,opacity] [transition-duration:320ms,320ms,200ms] " +
  "ease-[cubic-bezier(0.55,0,0.8,0.2)] motion-reduce:transition-none " +
  "group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:duration-0 " +
  "group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:duration-0";

// Theme ke hisaab se color: dark me white, light me black
const inner = "tt-flicker block size-full border-[var(--color-text)]";

const corners = [
  { pos: "-left-0.5 -top-0.5", back: "translate-x-2 translate-y-2", border: "border-l border-t" },
  { pos: "-right-0.5 -top-0.5", back: "-translate-x-2 translate-y-2", border: "border-r border-t" },
  { pos: "-bottom-0.5 -left-0.5", back: "translate-x-2 -translate-y-2", border: "border-b border-l" },
  { pos: "-bottom-0.5 -right-0.5", back: "-translate-x-2 -translate-y-2", border: "border-b border-r" },
];

// Icon swap: smooth ease-out-quint (overshoot nahi), thoda lamba taaki rotate dikhe
const icon =
  "absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "motion-reduce:transition-none will-change-transform";

const ThemeToggle = ({ isDark, onToggle }) => {
  const handleClick = () => {
    playClickSound();

    window.dispatchEvent(
      new CustomEvent("darkModeToggle", {
        detail: { x: window.innerWidth, y: 0 },
      })
    );

    window.setTimeout(() => onToggle(!isDark), 500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="
        group relative cursor-pointer inline-flex size-9 shrink-0 items-center justify-center
        text-[var(--color-text)]
        focus-visible:outline-none
        sm:size-8
      "
    >
      <style>{bulbCss}</style>

      {corners.map(({ pos, back, border }, i) => (
        <span key={i} aria-hidden="true" className={`${outer} ${pos} ${back}`}>
          <span className={`${inner} ${border}`} />
        </span>
      ))}

      <Sun
        aria-hidden="true"
        size={19}
        className={`${icon} ${
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        aria-hidden="true"
        size={19}
        className={`${icon} ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;