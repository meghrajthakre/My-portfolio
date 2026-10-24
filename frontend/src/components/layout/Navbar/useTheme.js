import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";

export const useTheme = () => {
  // Start every visit in dark mode, regardless of the saved preference.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, setIsDark };
};
