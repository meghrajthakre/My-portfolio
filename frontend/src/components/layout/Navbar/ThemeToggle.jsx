import { playClickSound } from "../../../lib/playClickSound";

// Bulb flicker hata diya. Brackets ab sirf smooth slide + fade karte hain.
// - Hover pe: icon ki taraf se bahar apni jagah pe 450ms me soft ease-out se aate hain
// - Hover hatne pe: wapas icon ki taraf 350ms me smooth ease-in-out se jaate hain
// Overshoot/bounce nahi hai, isliye ek hi baar khulte hain.
const outer =
  "pointer-events-none absolute size-2 opacity-0 will-change-[transform,opacity] " +
  "[transition-property:transform,translate,opacity] [transition-duration:350ms,350ms,300ms] " +
  "ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none " +
  "group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 " +
  "group-hover:[transition-duration:450ms,450ms,350ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 " +
  "group-focus-visible:[transition-duration:450ms,450ms,350ms] group-focus-visible:ease-[cubic-bezier(0.22,1,0.36,1)]";

// Theme ke hisaab se color: dark me white, light me black
const inner = "block size-full border-[var(--color-text)]";

const corners = [
  { pos: "-left-0.5 -top-0.5", back: "translate-x-2 translate-y-2", border: "border-l border-t" },
  { pos: "-right-0.5 -top-0.5", back: "-translate-x-2 translate-y-2", border: "border-r border-t" },
  { pos: "-bottom-0.5 -left-0.5", back: "translate-x-2 -translate-y-2", border: "border-b border-l" },
  { pos: "-bottom-0.5 -right-0.5", back: "-translate-x-2 -translate-y-2", border: "border-b border-r" },
];

// Icon swap: crossfade with stagger.
// - jaane wala icon jaldi (200ms, ease-in) nikalta hai
// - aane wala icon thoda ruk ke (100ms delay) 500ms me smooth ease-out se aata hai
const icon =
  "absolute transition-all motion-reduce:transition-none will-change-transform";
const iconIn = "duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)]";
const iconOut = "duration-200 delay-0 ease-in";

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
        theme-toggle-btn group relative cursor-pointer inline-flex size-9 shrink-0 items-center justify-center
        text-[var(--color-text)]
        focus-visible:outline-none
        sm:size-8
      "
    >
      {corners.map(({ pos, back, border }, i) => (
        <span key={i} aria-hidden="true" className={`${outer} ${pos} ${back}`}>
          <span className={`${inner} ${border}`} />
        </span>
      ))}

      <span
        aria-hidden="true"
        className={`${icon} size-[22px] bg-[var(--color-text)] ${
          isDark
            ? `${iconOut} scale-50 rotate-90 opacity-0`
            : `${iconIn} scale-100 rotate-0 opacity-100`
        }`}
        style={{
          mask: `url("${import.meta.env.BASE_URL}assets/origami-sun.svg") center / contain no-repeat`,
          WebkitMask: `url("${import.meta.env.BASE_URL}assets/origami-sun.svg") center / contain no-repeat`,
        }}
      />
      <span
        aria-hidden="true"
        className={`${icon} size-[22px] bg-[var(--color-text)] ${
          isDark
            ? `${iconIn} scale-100 rotate-0 opacity-100`
            : `${iconOut} scale-50 -rotate-90 opacity-0`
        }`}
        style={{
          mask: `url("${import.meta.env.BASE_URL}assets/moon-origami.svg") center / contain no-repeat`,
          WebkitMask: `url("${import.meta.env.BASE_URL}assets/moon-origami.svg") center / contain no-repeat`,
        }}
      />
    </button>
  );
};

export default ThemeToggle;