"use client";
import React from "react";
import { ThemeProvider } from "next-themes";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
    </ThemeProvider>
  );
}
