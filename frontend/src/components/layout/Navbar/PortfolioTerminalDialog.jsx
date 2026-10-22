import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { PROFILE } from "../../home/Introduction/profileContent";
import { ProjectsData } from "../../../data/ProjectsData";
import { techStack } from "../../../data/techStack";

const WELCOME_LINES = [
  "Developer Terminal Unlocked",
  "Access granted. Welcome, hacker! 😎",
  "Available commands: help, about, projects, skills, contact, matrix",
];

const PortfolioTerminalDialog = () => {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const openTerminal = () => setIsOpen(true);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("portfolio-terminal-open", openTerminal);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("portfolio-terminal-open", openTerminal);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHistory([{ id: Date.now(), command: null, lines: WELCOME_LINES }]);
      setInput("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const submitCommand = (event) => {
    event.preventDefault();
    const enteredCommand = input.trim();
    if (!enteredCommand) return;
    const command = enteredCommand.toLowerCase().split(/\s+/, 1)[0];
    setInput("");
    if (command === "clear") {
      setHistory([]);
      return;
    }
    if (command === "exit") {
      setIsOpen(false);
      return;
    }
    let lines;
    switch (command) {
      case "help": lines = ["Available commands: help, about, projects, skills, contact, matrix"]; break;
      case "about": lines = [`${PROFILE.name} — ${PROFILE.bio}`, `Roles: ${PROFILE.roles.join(" | ")}`]; break;
      case "projects": lines = ["Featured projects:", ...ProjectsData.map(({ title }) => `• ${title}`)]; break;
      case "skills": lines = [`Current tech stack: ${techStack.map(({ name }) => name).join(", ")}`]; break;
      case "contact": lines = [`Email: ${PROFILE.email}`, `Phone: ${PROFILE.phone}`, "You can also use the Contact page in the main navigation."]; break;
      case "matrix":
        window.dispatchEvent(new CustomEvent("portfolio-matrix-command"));
        lines = ["Digital rain enabled for 12 seconds."];
        break;
      default: lines = [`Unknown command: ${command}. Type help to see available commands.`];
    }
    setHistory((current) => [...current, { id: Date.now(), command: enteredCommand, lines }]);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[61] flex items-start justify-center bg-black/65 px-4 pt-[10vh] backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}>
      <section role="dialog" aria-modal="true" aria-label="Developer terminal" className={`w-full overflow-hidden rounded-xl border border-white/15 bg-[#18181a]/95 text-zinc-100 shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-[max-width] duration-300 ${isZoomed ? "max-w-5xl" : "max-w-3xl"}`}>
        <header className="relative flex h-9 select-none items-center border-b border-black/50 bg-gradient-to-b from-[#414144] to-[#2f2f32] px-3" onMouseDown={(event) => event.preventDefault()}>
          <div className="group relative z-10 flex items-center gap-2">
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close terminal" className="flex size-3 cursor-pointer items-center justify-center rounded-full border border-black/25 bg-[#ff5f57] text-black/60"><X aria-hidden="true" size={8} strokeWidth={3.5} className="opacity-0 group-hover:opacity-100" /></button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Minimize terminal" className="flex size-3 cursor-pointer items-center justify-center rounded-full border border-black/25 bg-[#febc2e] text-black/60"><Minus aria-hidden="true" size={8} strokeWidth={3.5} className="opacity-0 group-hover:opacity-100" /></button>
            <button type="button" onClick={() => setIsZoomed((zoomed) => !zoomed)} aria-label={isZoomed ? "Restore terminal size" : "Zoom terminal"} className="flex size-3 cursor-pointer items-center justify-center rounded-full border border-black/25 bg-[#28c840] text-black/60">{isZoomed ? <Minimize2 aria-hidden="true" size={8} strokeWidth={3.5} className="opacity-0 group-hover:opacity-100" /> : <Maximize2 aria-hidden="true" size={8} strokeWidth={3.5} className="opacity-0 group-hover:opacity-100" />}</button>
          </div>
          <div className="pointer-events-none absolute inset-x-16 flex items-center justify-center font-sans text-[12px] font-medium text-zinc-300"><span className="truncate">guest — -zsh — {isZoomed ? "120×36" : "80×24"}</span></div>
        </header>
        <div className="max-h-[min(72vh,42rem)] min-h-48 space-y-3 overflow-y-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-sm" aria-live="polite">
          {history.map(({ id, command, lines }) => <div key={id}>
            {command && <p className="break-words text-zinc-100"><span className="text-emerald-300">guest@portfolio ~ %</span> {command}</p>}
            {lines.map((line, index) => <p key={`${id}-${index}`} className="break-words whitespace-pre-wrap text-zinc-400">{line}</p>)}
          </div>)}
          <form onSubmit={submitCommand} className="flex items-center gap-2">
            <label htmlFor="portfolio-terminal-input" className="shrink-0 text-emerald-300">guest@portfolio ~ %</label>
            <input ref={inputRef} id="portfolio-terminal-input" value={input} onChange={(event) => setInput(event.target.value)} aria-label="Enter a portfolio command" autoComplete="off" autoCapitalize="none" spellCheck="false" className="min-w-0 flex-1 bg-transparent text-zinc-100 outline-none" />
          </form>
        </div>
      </section>
    </div>
  );
};

export default PortfolioTerminalDialog;
