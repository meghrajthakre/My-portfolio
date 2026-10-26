import { playClickSound } from "../../../lib/playClickSound";

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

  const iconColorClass = isDark
    ? "bg-[var(--color-secondary-text)] group-hover:bg-[var(--color-text)]"
    : "bg-[#000000] group-hover:bg-[#111111]";

  const maskStyle = (file) => {
    const url = `url("${import.meta.env.BASE_URL}assets/${file}") center / contain no-repeat`;
    return { mask: url, WebkitMask: url };
  };

  return (
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
      {/* Halka background: hover pe soft fade in */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md bg-[var(--color-icons-bg)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-60 group-focus-visible:opacity-60 motion-reduce:transition-none"
      />

      {/* Icon wrapper: hover pe halka sa bada, click pe halka dabta hai */}
      <span
        aria-hidden="true"
        className="relative flex size-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95 motion-reduce:transition-none"
      >
        <span
          className={`${icon} size-[22px] ${iconColorClass} ${
            isDark
              ? `${iconOut} scale-50 rotate-90 opacity-0`
              : `${iconIn} scale-100 rotate-0 opacity-100`
          }`}
          style={maskStyle("sun-theme.png")}
        />
        <span
          className={`${icon} size-[22px] ${iconColorClass} ${
            isDark
              ? `${iconIn} scale-100 rotate-0 opacity-100`
              : `${iconOut} scale-50 -rotate-90 opacity-0`
          }`}
          style={maskStyle("moon-origami.svg")}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;