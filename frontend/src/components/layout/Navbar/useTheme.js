import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" ? false : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, setIsDark };
};
