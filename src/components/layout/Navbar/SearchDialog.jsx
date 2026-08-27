import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

const SearchDialog = ({ isOpen, items, onClose, onSelect }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter(({ label }) => label.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => inputRef.current?.focus());
    else setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 px-4 pt-24 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label="Search pages" className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4">
          <Search aria-hidden="true" size={20} className="text-[var(--color-secondary-text)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && results[0] && onSelect(results[0].to)}
            placeholder="Search pages..."
            className="h-14 flex-1 bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-secondary-text)]"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="text-[var(--color-secondary-text)] cursor-pointer hover:text-[var(--color-text)]">
            <X size={19} />
          </button>
        </div>

        <div className="p-2">
          {results.length > 0 ? results.map((item) => (
            <button
              key={item.to}
              type="button"
              onClick={() => onSelect(item.to)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[var(--color-text)] hover:bg-[var(--color-icons-bg)]"
            >
              {item.label}
              <span className="text-xs">Enter</span>
            </button>
          )) : (
            <p className="px-3 py-5 text-center text-sm text-[var(--color-secondary-text)]">No page found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
