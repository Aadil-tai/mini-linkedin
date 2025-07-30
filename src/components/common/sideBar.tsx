// components/Sidebar.tsx
"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: "/feed", icon: "🏠" },
    { name: "Dashboard", path: "/feed/dashboard", icon: "📊" },
    { name: "Connections", path: "/feed/connections", icon: "👥" },
    { name: "Events", path: "/feed/events", icon: "📅" },
    { name: "Bit Pulse", path: "/feed/pulse", icon: "💓" },
    { name: "BIZ HUB", path: "/feed/hub", icon: "🏢" },
    { name: "Knowledge Hub", path: "/feed/knowledge", icon: "📚" },
  ];

  return (
    <aside
      className={`
    bg-white dark:bg-gray-800 shadow-lg transition-all duration-300
    ${sidebarOpen ? "w-64" : "w-20"}
    hidden md:block /* Always hide on mobile, show on medium screens and up */
  `}
    >
      {/* Sidebar Header - Logo Only */}
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
        <div className="flex items-center">
          {/* Logo icon - always visible */}
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            B
          </div>
          {/* Text - only visible when expanded */}
          {sidebarOpen && (
            <h1 className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">
              BizCivitas
            </h1>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {sidebarOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              pathname === item.path
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {sidebarOpen && (
              <span className="ml-3 font-poppins">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
