"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/common/sideBar";
import Header from "@/components/common/Header";

export default function MemberProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex flex-col flex-1 h-full">
          {/* Header */}
          <header className="h-[64px] bg-white dark:bg-gray-900 border-b z-30">
            <Header />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
