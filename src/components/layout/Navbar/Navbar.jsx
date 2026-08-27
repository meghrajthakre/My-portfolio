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

  return (
    <>
      <CircleCanvas isDark={isDark} />

      <header className="sticky top-0 z-50 backdrop-blur-xl">
        <nav aria-label="Main navigation" className="mx-auto flex h-[60px] w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          <NavLink
            to="/"
            aria-label="Go to home page"
            className="hidden shrink-0 overflow-hidden rounded-sm transition-opacity hover:opacity-80 sm:block"
          >
            <BrandLogo className="h-8 w-auto" />
          </NavLink>

          <div className="ml-auto flex items-center gap-5 sm:gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              {NAV_ITEMS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `text-sm font-medium transition-colors duration-200 ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-secondary-text)] hover:text-[var(--color-text)]"}`}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search pages (Ctrl K)"
              className="hidden h-8 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-icons-bg)] px-2 text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-text)] sm:flex"
            >
              <Search aria-hidden="true" size={16} strokeWidth={2.2} />
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-card-bg)] px-1 py-0.5 font-sans text-xs leading-none">Ctrl</kbd>
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-card-bg)] px-1 py-0.5 font-sans text-xs leading-none">K</kbd>
              </span>
            </button>
            <ThemeToggle isDark={isDark} onToggle={setIsDark} />
            </div>
          </div>
        </nav>
      </header>

      <SearchDialog
        isOpen={isSearchOpen}
        items={NAV_ITEMS}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
};

export default Navbar;
