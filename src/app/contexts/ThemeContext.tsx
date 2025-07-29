// contexts/ThemeContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define all possible theme types
type ThemePreference = "light" | "dark" | "system";
type ActiveTheme = "light" | "dark";

type ThemeContextType = {
  theme: ThemePreference; // User's preference
  resolvedTheme: ActiveTheme; // Currently applied theme
  isThemeLoaded: boolean;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ActiveTheme>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Get system preference
  const getSystemTheme = (): ActiveTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Resolve the actual theme to apply
  const resolveTheme = (preference: ThemePreference): ActiveTheme => {
    return preference === "system" ? getSystemTheme() : preference;
  };

  // Apply theme to DOM
  const applyTheme = (theme: ActiveTheme) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  };

  // Initialize theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get saved theme from localStorage or default to system
      const savedTheme = localStorage.getItem(
        "theme"
      ) as ThemePreference | null;
      const initialTheme = savedTheme || "system";
      const initialResolvedTheme = resolveTheme(initialTheme);

      setThemeState(initialTheme);
      setResolvedTheme(initialResolvedTheme);
      applyTheme(initialResolvedTheme);
      setIsThemeLoaded(true);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        if (theme === "system") {
          const newResolvedTheme = getSystemTheme();
          setResolvedTheme(newResolvedTheme);
          applyTheme(newResolvedTheme);
        }
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  // Handle theme changes
  const setTheme = (newTheme: ThemePreference) => {
    const newResolvedTheme = resolveTheme(newTheme);
    setThemeState(newTheme);
    setResolvedTheme(newResolvedTheme);
    applyTheme(newResolvedTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, isThemeLoaded, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
