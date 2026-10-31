import { Blocks, BriefcaseBusiness, FileText, Moon, Newspaper, Search, Sun } from "lucide-react";
import BrandLogo from "./BrandLogo";

const ITEM_META = {
  "/": { icon: BrandLogo, shortcut: "G H", isBrand: true },
  "/work": { icon: BriefcaseBusiness, shortcut: "G W" },
  "/blogs": { icon: Newspaper, shortcut: "G B" },
  "/resume": { icon: FileText, shortcut: "G R" },
  "/components": { icon: Blocks, shortcut: "G C" },
  "theme-light": { icon: Sun, shortcut: "T L" },
  "theme-dark": { icon: Moon, shortcut: "T D" },
};

const SearchPanel = ({ inputRef, query, onQueryChange, onKeyDown, activeId, onClose, results, selectedIndex, setSelectedIndex, onSelect }) => (
  <div role="dialog" aria-modal="true" aria-label="Search pages" className="sd-anim w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-[0_24px_70px_rgba(0,0,0,0.4)]" style={{ animation: "sd-pop 180ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
    <div className="flex h-14 items-center gap-3 px-4">
      <Search aria-hidden="true" size={18} className="shrink-0 text-[var(--color-secondary-text)]" />
      <input ref={inputRef} value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={onKeyDown} role="combobox" aria-expanded="true" aria-controls="search-results" aria-activedescendant={activeId} aria-label="Search pages and settings" placeholder="Search" className="h-full min-w-0 flex-1 bg-transparent text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-secondary-text)]" />
      <button type="button" onClick={onClose} aria-label="Close search" className="shrink-0 cursor-pointer rounded border border-[var(--color-border)] px-1.5 py-0.5 font-sans text-[11px] text-[var(--color-secondary-text)] transition-colors hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)]">Esc</button>
    </div>
    <div id="search-results" role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto border-t border-[var(--color-border)] p-1.5">
      {results.length ? results.map((item, index) => {
        const meta = ITEM_META[item.id] ?? { icon: FileText, shortcut: "" };
        const Icon = meta.icon;
        const selected = index === selectedIndex;
        return <button key={item.id} id={`search-option-${item.id}`} type="button" role="option" aria-selected={selected} onMouseMove={() => !selected && setSelectedIndex(index)} onClick={() => onSelect(item)} className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text)] ${selected ? "bg-[var(--color-icons-bg)]" : ""}`}>
          {meta.isBrand ? <BrandLogo className="h-[18px] w-[18px] shrink-0 text-[var(--color-secondary-text)]" /> : <Icon aria-hidden="true" size={18} strokeWidth={1.7} className="shrink-0 text-[var(--color-secondary-text)]" />}
          <span className="flex-1">{item.label}</span>
          {meta.shortcut && <span className="text-[11px] tracking-[0.15em] text-[var(--color-secondary-text)]">{meta.shortcut}</span>}
        </button>;
      }) : <p className="px-3 py-6 text-center text-sm text-[var(--color-secondary-text)]">No results</p>}
    </div>
    <div className="flex items-center justify-center gap-1.5 border-t border-[var(--color-border)] px-3 py-2.5 text-xs text-[var(--color-secondary-text)]"><span>To open the terminal, type</span><kbd className="rounded border border-[var(--color-border)] bg-[var(--color-icons-bg)] px-1.5 py-0.5 font-mono font-semibold text-[var(--color-text)]">sudo</kbd></div>
  </div>
);

export default SearchPanel;
