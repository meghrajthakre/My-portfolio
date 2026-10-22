import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import CircleCanvas from "../../Ui/CircleCanvas";
import BrandLogo from "./BrandLogo";
import { NAV_ITEMS } from "./navigation";
import SearchDialog from "./SearchDialog";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./useTheme";
import MatrixRain from "./MatrixRain";

const KONAMI_SEQUENCE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
const isEditableTarget = (target) => target instanceof HTMLElement && (
  target.isContentEditable
  || target.matches("input, textarea, select, [role='textbox']")
);

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRetroActive, setIsRetroActive] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [showMatrixNotice, setShowMatrixNotice] = useState(false);
  const [matrixRun, setMatrixRun] = useState(0);
  const { isDark, setIsDark } = useTheme();

  useEffect(() => {
    let sequenceIndex = 0;
    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsRetroActive(false);
        return;
      }
      if (isEditableTarget(event.target)) {
        sequenceIndex = 0;
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
        return;
      }
      if (event.repeat) return;

      const key = event.key.toLowerCase();
      if (key === KONAMI_SEQUENCE[sequenceIndex]) sequenceIndex += 1;
      else sequenceIndex = key === KONAMI_SEQUENCE[0] ? 1 : 0;

      if (sequenceIndex === KONAMI_SEQUENCE.length) {
        sequenceIndex = 0;
        setIsRetroActive(true);
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);

  useEffect(() => {
    if (!isRetroActive) {
      document.documentElement.classList.remove("retro-mode");
      return undefined;
    }

    document.documentElement.classList.add("retro-mode");
    const timerId = window.setTimeout(() => setIsRetroActive(false), 12000);
    return () => {
      window.clearTimeout(timerId);
      document.documentElement.classList.remove("retro-mode");
    };
  }, [isRetroActive]);

  useEffect(() => {
    if (!showMatrixNotice) return undefined;
    const timerId = window.setTimeout(() => setShowMatrixNotice(false), 3500);
    return () => window.clearTimeout(timerId);
  }, [showMatrixNotice]);

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleMatrixCommand = () => {
      setIsMatrixActive(true);
      setMatrixRun((run) => run + 1);
      setShowMatrixNotice(true);
    };
    window.addEventListener("portfolio-matrix-command", handleMatrixCommand);
    return () => window.removeEventListener("portfolio-matrix-command", handleMatrixCommand);
  }, []);

  const handleThemeSelect = (nextIsDark) => {
    setIsSearchOpen(false);
    if (nextIsDark === isDark) return;

    window.dispatchEvent(new CustomEvent("darkModeToggle", {
      detail: { x: window.innerWidth, y: 0 },
    }));
    window.setTimeout(() => setIsDark(nextIsDark), 500);
  };

  const handleMatrixDone = useCallback(() => setIsMatrixActive(false), []);

  return (
    <>
      <CircleCanvas isDark={isDark} />
      {isMatrixActive && <MatrixRain key={matrixRun} onDone={handleMatrixDone} />}

      {showMatrixNotice && (
        <div role="status" aria-live="polite" className="fixed left-1/2 top-20 z-[70] -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-text)] shadow-lg">
          You found the developer&apos;s secret! 🎉
        </div>
      )}

      {isRetroActive && (
        <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-3 text-sm text-[var(--color-text)] shadow-lg">
          <span>✨ Konami code unlocked: retro mode!</span>
          <button type="button" onClick={() => setIsRetroActive(false)} className="shrink-0 rounded-md border border-[var(--color-border)] px-2 py-1 text-xs font-semibold hover:bg-[var(--color-icons-bg)]">
            Turn off
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-border)_32%,transparent)] backdrop-blur-xl">
        <nav aria-label="Main navigation" className="mx-auto flex h-[60px] w-full max-w-3xl items-center border-x border-[color-mix(in_srgb,var(--color-border)_38%,transparent)] px-2 sm:px-8">
          <NavLink
            to="/"
            aria-label="Go to home page"
            className="block shrink-0 overflow-hidden rounded-sm text-black transition-opacity hover:opacity-80 dark:text-white"
          >
            <BrandLogo className="h-7 w-auto sm:h-8" />
          </NavLink>

          <div className="ml-auto flex items-center gap-2 sm:gap-6">
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `text-xs font-medium transition-colors duration-200 hover:text-yellow-400 sm:text-sm ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-secondary-text)]"}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-6 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search pages (Ctrl K)"
              className="flex h-8 items-center gap-1.5 rounded-full border-0 bg-transparent px-2 text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-text)] md:border md:border-[var(--color-border)]"
            >
              <Search aria-hidden="true" size={16} strokeWidth={2.2} />
              <span className="hidden items-center gap-1 md:flex">
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--profile-icon-bg)] px-1 py-0.5 font-sans text-xs leading-none">Ctrl</kbd>
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--profile-icon-bg)] px-1 py-0.5 font-sans text-xs leading-none">K</kbd>
              </span>
            </button>
            <ThemeToggle isDark={isDark} onToggle={setIsDark} />
          </div>
        </nav>
      </header>

      <SearchDialog
        isOpen={isSearchOpen}
        items={NAV_ITEMS}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelect}
        onThemeSelect={handleThemeSelect}
      />
    </>
  );
};

export default Navbar;
