import { useEffect, useRef, useState } from "react";
import { playCopySound } from "../../../lib/playCopySound";

export const useCopyEmail = (email) => {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    playCopySound();

    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setIsCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return { isCopied, copyEmail };
};
