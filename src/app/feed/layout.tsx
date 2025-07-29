"use client";
import React from "react";
import Sidebar from "../components/common/sideBar";
import Header from "../components/common/Header";
import RightSidebar from "../components/common/RightSidebar";
import { ThemeProvider } from "next-themes";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar should start at the top and be fixed */}
        <Sidebar />

        {/* Main Area (Header + Content) */}
        <div className="flex flex-col flex-1  h-full">
          {/* Header */}
          <header className="h-[64px] bg-white dark:bg-gray-900 border-b z-30">
            <Header />
          </header>

          {/* Feed and Right Sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Feed */}
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>

            {/* Right Sidebar */}
            <aside className="w-[320px] bg-white dark:bg-gray-800 border-l p-4 overflow-y-auto">
              <RightSidebar />
            </aside>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
