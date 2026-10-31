import { useCallback, useEffect, useRef, useState } from "react";
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

// Two-key shortcuts shown in the search dialog: "G H" goes home, "T D" switches to dark mode, etc.
const GO_SHORTCUTS = { h: "/", w: "/work", b: "/blogs", r: "/resume", c: "/components" };
const THEME_SHORTCUTS = { l: false, d: true }; // value = "is dark"

const IS_MAC = typeof navigator !== "undefined" && /mac|iphone|ipad/i.test(navigator.userAgentData?.platform ?? navigator.platform ?? "");
const SEARCH_KEY = IS_MAC ? "⌘" : "Ctrl";

const isEditableTarget = (target) => target instanceof HTMLElement && (
  target.isContentEditable
  || target.matches("input, textarea, select, [role='textbox']")
);

const Toast = ({ className = "", children }) => (
  <div
    role="status"
    aria-live="polite"
    className={`nb-fade fixed z-[70] rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] shadow-lg ${className}`}
  >
    {children}
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const actionsRef = useRef({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRetroActive, setIsRetroActive] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [showMatrixNotice, setShowMatrixNotice] = useState(false);
  const [matrixRun, setMatrixRun] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, setIsDark } = useTheme();

  const handleSelect = (path) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  const handleThemeSelect = (nextIsDark) => {
    setIsSearchOpen(false);
    if (nextIsDark === isDark) return;

    window.dispatchEvent(new CustomEvent("darkModeToggle", {
      detail: { x: window.innerWidth, y: 0 },
    }));
    window.setTimeout(() => setIsDark(nextIsDark), 500);
  };

  const handleMatrixDone = useCallback(() => setIsMatrixActive(false), []);

  // The keyboard handler is registered once, so it reads the latest actions through a ref
  useEffect(() => {
    actionsRef.current = { go: handleSelect, theme: handleThemeSelect };
  });

  useEffect(() => {
    let sequenceIndex = 0;
    let chord = null; // "g" or "t", waiting for the second key
    let chordTimer = 0;

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsRetroActive(false);
        return;
      }
      if (isEditableTarget(event.target)) {
        sequenceIndex = 0;
        chord = null;
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key.toLowerCase();

      // Second key of a chord: G then H/W/B/R, or T then L/D
      if (chord) {
        const activeChord = chord;
        chord = null;
        window.clearTimeout(chordTimer);
        const target = activeChord === "g" ? GO_SHORTCUTS[key] : THEME_SHORTCUTS[key];
        if (target !== undefined) {
          event.preventDefault();
          sequenceIndex = 0;
          if (activeChord === "g") actionsRef.current.go?.(target);
          else actionsRef.current.theme?.(target);
          return;
        }
      }

      if (event.repeat) return;

      // First key of a chord
      if (key === "g" || key === "t") {
        chord = key;
        chordTimer = window.setTimeout(() => {
          chord = null;
        }, 1000);
      }

      // Konami code
      if (key === KONAMI_SEQUENCE[sequenceIndex]) sequenceIndex += 1;
      else sequenceIndex = key === KONAMI_SEQUENCE[0] ? 1 : 0;

      if (sequenceIndex === KONAMI_SEQUENCE.length) {
        sequenceIndex = 0;
        setIsRetroActive(true);
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => {
      window.clearTimeout(chordTimer);
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  // Retro mode
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

  // Matrix notice auto-hides
  useEffect(() => {
    if (!showMatrixNotice) return undefined;
    const timerId = window.setTimeout(() => setShowMatrixNotice(false), 3500);
    return () => window.clearTimeout(timerId);
  }, [showMatrixNotice]);

  // `matrix` command from the terminal
  useEffect(() => {
    const handleMatrixCommand = () => {
      setIsMatrixActive(true);
      setMatrixRun((run) => run + 1);
      setShowMatrixNotice(true);
    };
    window.addEventListener("portfolio-matrix-command", handleMatrixCommand);
    return () => window.removeEventListener("portfolio-matrix-command", handleMatrixCommand);
  }, []);

  // Header gets a frosted background once you scroll, plus a thin reading-progress line
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(y > 8);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes nb-fade { from { opacity: 0 } to { opacity: 1 } }
        .nb-fade { animation: nb-fade 200ms ease-out }
        @media (prefers-reduced-motion: reduce) { .nb-fade { animation: none } }
      `}</style>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80] focus:rounded-md focus:bg-[var(--color-card-bg)] focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-text)] focus:shadow-lg focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        Skip to content
      </a>

      <CircleCanvas isDark={isDark} />
      {isMatrixActive && <MatrixRain key={matrixRun} onDone={handleMatrixDone} />}

      {showMatrixNotice && (
        <Toast className="left-1/2 top-20 -translate-x-1/2 px-4 py-3 text-center font-semibold">
          You found the developer&apos;s secret! 🎉
        </Toast>
      )}

      {isRetroActive && (
        <Toast className="bottom-4 right-4 flex max-w-[calc(100vw-2rem)] items-center gap-3 p-3">
          <span>✨ Konami code unlocked: retro mode!</span>
          <button
            type="button"
            onClick={() => setIsRetroActive(false)}
            className="shrink-0 cursor-pointer rounded-md border border-[var(--color-border)] px-2 py-1 text-xs font-semibold hover:bg-[var(--color-icons-bg)]"
          >
            Turn off
          </button>
        </Toast>
      )}

      <header className="sticky top-0 z-50 isolate mx-auto w-full max-w-3xl">
        <div aria-hidden="true" className={`navbar-blur-fade pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}`} />
        <nav
          aria-label="Main navigation"
          className="relative z-10 flex h-[60px] w-full items-center px-2 sm:px-8"
        >
          <NavLink
            to="/"
            aria-label="Go to home page"
            className="block shrink-0 overflow-hidden rounded-sm text-black transition-opacity hover:opacity-80 dark:text-white"
          >
            <BrandLogo className="h-7 w-auto sm:h-8" />
          </NavLink>

          <div className="ml-auto flex h-full items-center">
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"} // without this, Home would count as active on every page
                className={({ isActive }) => `relative flex h-full items-center px-1 text-xs font-medium transition-colors duration-200 hover:text-[var(--color-text)] sm:px-3 sm:text-sm ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-secondary-text)]"}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-4 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={`Search pages (${SEARCH_KEY} K)`}
              title={`Search (${SEARCH_KEY} K)`}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-2 text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-text)] md:border md:border-[var(--color-border)]"
            >
              <Search aria-hidden="true" size={16} strokeWidth={2.2} />
              <span className="hidden items-center gap-1 md:flex">
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--profile-icon-bg)] px-1 py-0.5 font-sans text-xs leading-none">{SEARCH_KEY}</kbd>
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--profile-icon-bg)] px-1 py-0.5 font-sans text-xs leading-none">K</kbd>
              </span>
            </button>
            <ThemeToggle isDark={isDark} onToggle={setIsDark} />
          </div>
        </nav>

        {/* Reading progress */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-px z-20 h-0.5 overflow-hidden">
          <div ref={progressRef} className="h-full origin-left scale-x-0 bg-[var(--color-accent)]" />
        </div>
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
