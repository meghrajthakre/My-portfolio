import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import CircleCanvas from "../../Ui/CircleCanvas";
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
        <nav aria-label="Main navigation" className="mx-auto flex h-[50px] w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-5 sm:gap-8">
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `text-[15px] font-medium transition-colors duration-200 sm:text-base ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-secondary-text)] hover:text-[var(--color-text)]"}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search pages (Ctrl K)"
              className="hidden h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-icons-bg)] px-3 text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-text)] sm:flex"
            >
              <Search aria-hidden="true" size={19} strokeWidth={2.2} />
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-card-bg)] px-1.5 py-0.5 font-sans text-sm leading-none">Ctrl</kbd>
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-card-bg)] px-1.5 py-0.5 font-sans text-sm leading-none">K</kbd>
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
      />
    </>
  );
};

export default Navbar;
