import { useEffect, useState } from "react";

export interface ThemeColors {
  background: string;
  foreground: string;
  border: string;
  chart1: string;
  card: string;
}

export const useThemeColors = (): ThemeColors => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    // Initial check
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode
    ? {
        background: "#18181b",
        foreground: "#fafafa",
        border: "#303032",
        chart1: "#e1356f",
        card: "#09090b",
      }
    : {
        background: "#ffffff",
        foreground: "#09090b",
        border: "#a0a0a0",
        chart1: "#e4497e",
        card: "#fafafa",
      };
};
