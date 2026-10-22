import { useEffect, useMemo, useRef, useState } from "react";
import SearchPanel from "./SearchPanel";

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
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSearchChange = (value) => {
    if (value.trim().toLowerCase() === "sudo") {
      setQuery("");
      onClose();
      window.dispatchEvent(new CustomEvent("portfolio-terminal-open"));
      return;
    }
    setQuery(value);
    setSelectedIndex(0);
  };

  const executeCommand = (command) => {
    if (command.type === "theme") onThemeSelect(command.value);
    else onSelect(command.to);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setSelectedIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setSelectedIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && results[selectedIndex]) {
      executeCommand(results[selectedIndex]);
    }
  };

  const activeId = results[selectedIndex] ? `search-option-${results[selectedIndex].id}` : undefined;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <SearchPanel
          inputRef={inputRef}
          query={query}
          onQueryChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          activeId={activeId}
          onClose={onClose}
          results={results}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          onSelect={executeCommand}
        />
      </div>}
    </>
  );
};

export default SearchDialog;
