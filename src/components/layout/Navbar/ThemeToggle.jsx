import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ isDark, onToggle }) => {
  const handleClick = () => {
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
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[var(--color-text)] transition-all duration-300 hover:rotate-12 hover:bg-[var(--color-icons-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-90"
    >
      {isDark ? <Sun aria-hidden="true" size={20} /> : <Moon aria-hidden="true" size={19} />}
    </button>
  );
};

export default ThemeToggle;
