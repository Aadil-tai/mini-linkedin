"use client";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useState, useEffect } from "react";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: string;
};

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, isThemeLoaded } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes: ThemeOption[] = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ];

  // Show loading state during SSR
  if (!mounted || !isThemeLoaded) {
    return (
      <div className="p-2 rounded-lg">
        <div className="w-6 h-6" />
      </div>
    );
  }

  // Get the appropriate icon for the current theme
  const currentThemeIcon =
    themes.find((t) => t.value === (theme === "system" ? resolvedTheme : theme))
      ?.icon || "☀️";

  return (
    <div className="relative">
      {/* Main toggle button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1 transition-colors duration-200"
        aria-label="Toggle theme"
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentThemeIcon}</span>
        <ChevronDownIcon />
      </button>

      {/* Dropdown menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20"
            role="menu"
          >
            {themes.map((option) => (
              <ThemeOptionButton
                key={option.value}
                option={option}
                isActive={theme === option.value}
                onClick={() => {
                  setTheme(option.value);
                  setShowDropdown(false);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Sub-component for individual theme options
function ThemeOptionButton({
  option,
  isActive,
  onClick,
}: {
  option: ThemeOption;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-300"
      }`}
      role="menuitem"
    >
      <span>{option.icon}</span>
      <span className="text-sm">{option.label}</span>
      {isActive && <CheckIcon />}
    </button>
  );
}

// SVG Icons as separate components
function ChevronDownIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-600 dark:text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}
