import dynamic from "next/dynamic";
const GoogleButton = dynamic(() => import("@/components/common/GoogleButton"), {
  ssr: false,
});
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini-LinkedIn - Your Professional Network",
  description:
    "Connect with professionals, build your network, and advance your career on Mini-LinkedIn.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 overflow-x-hidden">
      {/* Animated background elements - Adjusted for mobile */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 md:-top-40 md:-right-40 md:w-80 md:h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 md:-bottom-40 md:-left-40 md:w-80 md:h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div> */}

      <div className="relative container mx-auto px-4 sm:px-6 py-8">
        {/* Header - Made responsive */}
        <header className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 backdrop-blur-sm gap-4">
          <div className="flex items-center space-x-2 sm:px-12 px-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ML</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mini-LinkedIn
            </h1>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/login"
              className="px-4 py-1.5 sm:px-6 sm:py-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-1.5 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              Join now
            </Link>
          </nav>
        </header>

        {/* Main Content - Responsive layout */}
        <main className="flex flex-col lg:flex-row xl:px-[8%] items-center justify-between mt-8 sm:mt-12 lg:mt-16 xl:mt-20 gap-8">
          <div className="w-full lg:w-1/2 mb-8 sm:mb-12 lg:mb-0 space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
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
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Connect with industry professionals, showcase your expertise,
                and unlock new career opportunities.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 max-w-md">
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
                className="group block w-full text-center py-2.5 px-4 sm:py-3.5 sm:px-6 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-0.5 transform"
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

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg">
              {/* Modern illustration placeholder with glassmorphism */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-3xl aspect-square flex flex-col items-center justify-center border border-white/50 dark:border-gray-700/50 shadow-2xl p-4">
                  {/* Professional network visualization - Adjusted for mobile */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
