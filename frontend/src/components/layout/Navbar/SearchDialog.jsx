import { useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, FileText, Moon, Newspaper, Search, Sun, Terminal, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const ITEM_META = {
  "/": { icon: BrandLogo, shortcut: "G H", isBrand: true },
  "/work": { icon: BriefcaseBusiness, shortcut: "G W" },
  "/blogs": { icon: Newspaper, shortcut: "G B" },
  "/resume": { icon: FileText, shortcut: "G R" },
  "theme-light": { icon: Sun, shortcut: "T L" },
  "theme-dark": { icon: Moon, shortcut: "T D" },
};

const SearchDialog = ({ isOpen, items, onClose, onSelect, onThemeSelect, onTerminalCommand }) => {
  const inputRef = useRef(null);
  const terminalInputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState("");

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
    if (isOpen) requestAnimationFrame(() => (isTerminalOpen ? terminalInputRef.current : inputRef.current)?.focus());
    else {
      setQuery("");
      setSelectedIndex(0);
      setIsTerminalOpen(false);
      setTerminalHistory([]);
      setTerminalInput("");
    }
  }, [isOpen, isTerminalOpen]);

  const openTerminal = () => {
    setIsTerminalOpen(true);
    setTerminalInput("");
    setTerminalHistory([{
      id: Date.now(),
      command: "",
      lines: ["Portfolio terminal ready. This is an interactive portfolio feature; no shell commands are run.", "Type help to see available commands."],
    }]);
  };

  const handleSearchChange = (value) => {
    setQuery(value);
    setSelectedIndex(0);
    if (value.trim().toLowerCase() === "sudo") openTerminal();
  };

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

  const executeTerminalCommand = (event) => {
    event.preventDefault();
    const enteredCommand = terminalInput.trim();
    if (!enteredCommand) return;

    const command = enteredCommand.toLowerCase().split(/\s+/, 1)[0];
    setTerminalInput("");
    if (command === "clear") {
      setTerminalHistory([]);
      return;
    }
    if (command === "exit") {
      setIsTerminalOpen(false);
      setTerminalHistory([]);
      setQuery("");
      return;
    }

    const lines = onTerminalCommand(command);
    setTerminalHistory((history) => [
      ...history,
      { id: Date.now(), command: enteredCommand, lines },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={isTerminalOpen ? "Portfolio terminal" : "Search pages"} className="w-full max-w-lg overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        {isTerminalOpen ? (
          <>
            <div className="flex h-13 items-center gap-3 border-b border-[var(--color-border)] px-4">
              <Terminal aria-hidden="true" size={18} className="shrink-0 text-[var(--color-accent)]" />
              <p className="flex-1 text-sm font-semibold text-[var(--color-text)]">Portfolio terminal</p>
              <button type="button" onClick={() => {
                setIsTerminalOpen(false);
                setTerminalHistory([]);
                setQuery("");
              }} aria-label="Close terminal" className="cursor-pointer rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-secondary-text)] transition-colors hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)]">Esc</button>
            </div>
            <div className="max-h-[55vh] min-h-40 space-y-3 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed sm:text-sm" aria-live="polite">
              {terminalHistory.map(({ id, command, lines }) => (
                <div key={id}>
                  {command && <p className="break-words text-[var(--color-text)]"><span className="text-emerald-500">guest@portfolio:~$</span> {command}</p>}
                  {lines.map((line, index) => <p key={`${id}-${index}`} className="break-words whitespace-pre-wrap text-[var(--color-secondary-text)]">{line}</p>)}
                </div>
              ))}
            </div>
            <form onSubmit={executeTerminalCommand} className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-3 font-mono text-xs sm:text-sm">
              <label htmlFor="portfolio-terminal-input" className="shrink-0 text-emerald-500">guest@portfolio:~$</label>
              <input
                ref={terminalInputRef}
                id="portfolio-terminal-input"
                value={terminalInput}
                onChange={(event) => setTerminalInput(event.target.value)}
                aria-label="Enter a portfolio command"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                className="min-w-0 flex-1 bg-transparent text-[var(--color-text)] outline-none"
              />
            </form>
          </>
        ) : (
          <>
            <div className="flex h-14 items-center gap-3 border-b border-[var(--color-border)] px-4">
              <Search aria-hidden="true" size={18} className="shrink-0 text-[var(--color-secondary-text)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => handleSearchChange(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search pages and appearance settings"
                placeholder="Search pages and settings..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-secondary-text)] sm:text-base"
              />
              {query && <button type="button" onClick={() => handleSearchChange("")} aria-label="Clear search" className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--color-secondary-text)] transition-colors hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)]"><X aria-hidden="true" size={15} /></button>}
              <button type="button" onClick={onClose} aria-label="Close search" className="shrink-0 cursor-pointer rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-secondary-text)] transition-colors hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)]">Esc</button>
            </div>

            <div className="mx-2 my-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5">
              <div className="flex items-center justify-between px-2.5 pb-1.5 pt-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary-text)]">Pages &amp; appearance</p>
                <span className="text-xs text-[var(--color-secondary-text)]">{results.length} {results.length === 1 ? "result" : "results"}</span>
              </div>
              <div role="listbox" aria-label="Search results" className="max-h-[min(50vh,22rem)] space-y-1 overflow-y-auto">
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
                      {meta.shortcut && <span className="text-[10px] font-medium tracking-[0.15em] text-[var(--color-secondary-text)]">{meta.shortcut}</span>}
                    </button>
                  );
                }) : <div className="px-3 py-8 text-center"><p className="text-sm font-medium text-[var(--color-text)]">No results found</p><p className="mt-1 text-xs text-[var(--color-secondary-text)]">Try a page name like Work or Resume.</p></div>}
              </div>
            </div>

            <div className="flex h-11 items-center justify-between px-4 text-sm">
              <BrandLogo className="h-6 w-auto text-[var(--color-secondary-text)]" />
              <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
                <span>Go to page</span>
                <kbd className="flex size-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-icons-bg)] text-[var(--color-secondary-text)]">↵</kbd>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchDialog;
