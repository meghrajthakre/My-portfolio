import { useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, FileText, Moon, Newspaper, Search, Sun } from "lucide-react";
import BrandLogo from "./BrandLogo";

const ITEM_META = {
  "/": { icon: BrandLogo, shortcut: "G H", isBrand: true },
  "/work": { icon: BriefcaseBusiness, shortcut: "G W" },
  "/blogs": { icon: Newspaper, shortcut: "G B" },
  "/resume": { icon: FileText, shortcut: "G R" },
  "theme-light": { icon: Sun, shortcut: "T L" },
  "theme-dark": { icon: Moon, shortcut: "T D" },
};

const SearchDialog = ({ isOpen, items, onClose, onSelect, onThemeSelect }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = useMemo(() => [
    ...items.map((item) => ({ ...item, id: item.to, type: "route" })),
    { id: "theme-light", label: "Light mode", type: "theme", value: false },
    { id: "theme-dark", label: "Dark mode", type: "theme", value: true },
  ], [items]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return commands.filter(({ label }) => label.toLowerCase().includes(normalizedQuery));
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => inputRef.current?.focus());
    else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setSelectedIndex((current) => (current + 1) % results.length);
    }

    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setSelectedIndex((current) => (current - 1 + results.length) % results.length);
    }

    if (event.key === "Enter" && results[selectedIndex]) executeCommand(results[selectedIndex]);
  };

  const executeCommand = (command) => {
    if (command.type === "theme") onThemeSelect(command.value);
    else onSelect(command.to);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label="Search pages" className="w-full max-w-lg overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex h-13 items-center gap-3 px-4">
          <Search aria-hidden="true" size={18} className="shrink-0 text-[var(--color-secondary-text)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="h-full flex-1 bg-transparent text-sm font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-secondary-text)] sm:text-base"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="cursor-pointer rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-secondary-text)] transition-colors hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)]">Esc</button>
        </div>

        <div className="mx-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5">
          <p className="px-2.5 pb-1.5 pt-1.5 text-sm font-medium text-[var(--color-secondary-text)]">Menu &amp; Appearance</p>
          <div role="listbox" aria-label="Pages" className="space-y-1">
            {results.length > 0 ? results.map((item, index) => {
              const meta = ITEM_META[item.id] ?? { icon: FileText, shortcut: "" };
              const Icon = meta.icon;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => executeCommand(item)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition-colors ${isSelected ? "bg-[var(--color-icons-bg)]" : "hover:bg-[var(--color-icons-bg)]"} text-[var(--color-text)]`}
                >
                  {meta.isBrand ? (
                    <BrandLogo className="h-5 w-5 shrink-0 text-[var(--color-secondary-text)]" />
                  ) : (
                    <Icon aria-hidden="true" size={18} strokeWidth={1.7} className="shrink-0 text-[var(--color-secondary-text)]" />
                  )}
                  <span className="flex-1">{item.label}</span>
                  <span className="text-xs font-normal tracking-[0.2em] text-[var(--color-secondary-text)]">{meta.shortcut}</span>
                </button>
              );
            }) : <p className="px-3 py-8 text-center text-sm text-[var(--color-secondary-text)]">No page found</p>}
          </div>
        </div>

        <div className="flex h-11 items-center justify-between px-4 text-sm">
          <BrandLogo className="h-6 w-auto text-[var(--color-secondary-text)]" />
          <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
            <span>Go to page</span>
            <kbd className="flex size-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-icons-bg)] text-[var(--color-secondary-text)]">↵</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
