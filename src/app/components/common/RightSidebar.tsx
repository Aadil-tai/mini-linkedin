import React from "react";
import { X, Search } from "lucide-react";

const RightSidebar = () => {
  return (
    <div className="w-full max-w-[320px] h-full overflow-y-auto bg-white dark:bg-gray-800 p-4 border-l space-y-6">
      {/* Search Header */}
      <div className="flex items-center border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700">
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white"
        />
        <X className="w-4 h-4 text-gray-400 cursor-pointer" />
      </div>

      {/* Recent Posts */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent posts
        </h3>

        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex space-x-2 border rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-md" />
            <div className="flex-1">
              <p className="text-sm font-medium truncate">
                Egestas libero nulla facilisi...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                20 mins ago
              </p>
            </div>
          </div>
        ))}

        {/* Community Choice Webinar Section */}
        <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Community Choice Webinar 2025
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            What should we cover in our upcoming webinar?
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Cast your vote and decide the webinar topic!
          </p>
          <div className="space-y-2">
            <button className="w-full text-xs px-3 py-2 rounded-md bg-white dark:bg-gray-800 border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              Future of AI & Automation
            </button>
            <button className="w-full text-xs px-3 py-2 rounded-md bg-white dark:bg-gray-800 border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              Digital Marketing Trends
            </button>
          </div>
        </div>

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex space-x-2 border rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-md" />
            <div className="flex-1">
              <p className="text-sm font-medium truncate">
                Egestas libero nulla facilisi...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                20 mins ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
