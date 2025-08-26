// components/Sidebar.tsx
"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// Component to load and display inline SVG
function InlineSvgIcon({
  src,
  className = "w-4 h-4",
  color,
}: {
  src: string;
  className?: string;
  color?: string;
}) {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((svg) => {
        if (color) {
          const modifiedSvg = svg
            .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
            .replace(/fill="[^"]*"/g, (match) =>
              match.includes('fill="none"') ? match : `fill="${color}"`
            );
          setSvgContent(modifiedSvg);
        } else {
          setSvgContent(svg);
        }
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }, [src, color]);

  if (!svgContent) {
    return <div className={`${className} bg-gray-200 animate-pulse rounded`} />;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

// Arrow Icons
const ArrowLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
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
);

const ArrowRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
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
);

// Navigation items with icons
const menuItems = [
  { name: "Home", path: "/feed", icon: "/dashboard/sidebaricons/home.svg" },
  {
    name: "Dashboard",
    path: "/feed/dashboard",
    icon: "/dashboard/sidebaricons/dashboard.svg",
  },
  {
    name: "Connections",
    path: "/feed/connections",
    icon: "/dashboard/sidebaricons/connections.svg",
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`relative h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } hidden md:block`}
    >
      {/* Header with Logo */}
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => router.push("/feed")}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-white font-bold text-sm">ML</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mini-LinkedIn
            </span>
          )}
        </div>
      </div>

      {/* Toggle Button (Floating, Desktop only) */}
      <div
        className={`absolute top-16 transition-all duration-300 ${
          isCollapsed ? "right-[-14px]" : "right-[-10px]"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ArrowRightIcon className="w-4 h-4 text-white" />
          ) : (
            <ArrowLeftIcon className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}
              title={isCollapsed ? item.name : undefined}
            >
              <InlineSvgIcon
                src={item.icon}
                className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"}`}
                color={isActive ? "#1d4ed8" : "#6b7280"}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
