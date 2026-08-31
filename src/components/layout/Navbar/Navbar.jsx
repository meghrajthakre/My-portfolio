import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import CircleCanvas from "../../Ui/CircleCanvas";
import BrandLogo from "./BrandLogo";
import { NAV_ITEMS } from "./navigation";
import SearchDialog from "./SearchDialog";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./useTheme";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDark, setIsDark } = useTheme();

  useEffect(() => {
    const handleKeyboard = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === "Escape") setIsSearchOpen(false);
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);

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

  return (
    <>
      <CircleCanvas isDark={isDark} />

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
