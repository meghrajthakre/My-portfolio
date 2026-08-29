import { useRef } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ isDark, onToggle }) => {
  const audioCtxRef = useRef(null);

  const playClickSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    // Two-tone click for more satisfying feedback
    const duration = 0.08;
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Combine two frequencies for a richer sound
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      // Main click: 800Hz with fast decay
      const click = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 50);
      // Sub click: 400Hz for body
      const body = Math.sin(2 * Math.PI * 400 * t) * Math.exp(-t * 30) * 0.3;
      data[i] = (click + body) * 0.7;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(gain);
    gain.connect(ctx.destination);

    source.start(ctx.currentTime);
  };

  const handleClick = () => {
    playClickSound();

    window.dispatchEvent(new CustomEvent("darkModeToggle", {
      detail: { x: window.innerWidth, y: 0 },
    }));

    window.setTimeout(() => onToggle(!isDark), 500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text)] transition-colors duration-300 hover:bg-[var(--color-icons-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-90 sm:size-10"
    >
      <Sun
        aria-hidden="true"
        size={19}
        className={`cursor-pointer absolute transition-all duration-300 ease-out ${
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        aria-hidden="true"
        size={19}
        className={`cursor-pointer absolute transition-all duration-300 ease-out ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
