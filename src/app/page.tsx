import { GoogleButton } from "@/components/common/GoogleButton";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini-LinkedIn - Your Professional Network",
  description:
    "Connect with professionals, build your network, and advance your career on Mini-LinkedIn.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center py-6 backdrop-blur-sm">
          <div className="flex items-center space-x-2 px-12">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ML</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mini-LinkedIn
            </h1>
          </div>
          <nav className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-6 py-2.5 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              Join now
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex flex-col lg:flex-row xl:px-[8%] items-center justify-between mt-16 lg:mt-20">
          <div className="lg:w-1/2 mb-16 lg:mb-0 space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900 dark:text-white">
                  Build your
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  professional
                </span>
                <span className="block text-gray-900 dark:text-white">
                  network
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Connect with industry professionals, showcase your expertise,
                and unlock new career opportunities.
              </p>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <GoogleButton text="Continue with Google" />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 text-gray-500 dark:text-gray-400 font-medium">
                    or
                  </span>
                </div>
              </div>

              <Link
                href="/login"
                className="group block w-full text-center py-3.5 px-6 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-0.5 transform"
              >
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Sign in with email
                </span>
              </Link>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                By continuing, you agree to Mini-LinkedIn's{" "}
                <Link
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  User Agreement
                </Link>
                ,{" "}
                <Link
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                , and{" "}
                <Link
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Modern illustration placeholder with glassmorphism */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-3xl aspect-square flex flex-col items-center justify-center border border-white/50 dark:border-gray-700/50 shadow-2xl">
                  {/* Professional network visualization */}
                  <div className="space-y-6">
                    <div className="flex justify-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse delay-300">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse delay-500">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-pulse delay-700">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse delay-1000">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Connecting lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <line
                        x1="35"
                        y1="30"
                        x2="50"
                        y2="50"
                        stroke="url(#gradient1)"
                        strokeWidth="0.5"
                        opacity="0.6"
                      />
                      <line
                        x1="65"
                        y1="30"
                        x2="50"
                        y2="50"
                        stroke="url(#gradient2)"
                        strokeWidth="0.5"
                        opacity="0.6"
                      />
                      <line
                        x1="35"
                        y1="70"
                        x2="50"
                        y2="50"
                        stroke="url(#gradient3)"
                        strokeWidth="0.5"
                        opacity="0.6"
                      />
                      <line
                        x1="65"
                        y1="70"
                        x2="50"
                        y2="50"
                        stroke="url(#gradient4)"
                        strokeWidth="0.5"
                        opacity="0.6"
                      />
                      <defs>
                        <linearGradient
                          id="gradient1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#6366F1" />
                        </linearGradient>
                        <linearGradient
                          id="gradient2"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                        <linearGradient
                          id="gradient3"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                        <linearGradient
                          id="gradient4"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
      </div>
    </div>
  );
}
