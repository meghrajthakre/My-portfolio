import { Moon, Sun } from "lucide-react";
import { playClickSound } from "../../../lib/playClickSound";

const ThemeToggle = ({ isDark, onToggle }) => {
  const handleClick = () => {
    playClickSound();

    window.dispatchEvent(new CustomEvent("darkModeToggle", {
      detail: { x: window.innerWidth, y: 0 },
    }));

    window.setTimeout(() => onToggle(!isDark), 500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text)] transition-colors duration-300 hover:bg-[var(--color-icons-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-90 sm:size-10"
    >
      <Sun
        aria-hidden="true"
        size={19}
        className={`cursor-pointer absolute transition-all duration-300 ease-out ${
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        aria-hidden="true"
        size={19}
        className={`cursor-pointer absolute transition-all duration-300 ease-out ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
