import { useEffect, useRef, useState } from "react";

export const useCopyEmail = (email) => {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
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
