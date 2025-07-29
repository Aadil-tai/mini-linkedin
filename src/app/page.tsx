"use client";

import Link from "next/link";
import { GoogleButton } from "./components/common/GoogleButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            YourLogo
          </h1>
          <nav>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-blue-600 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 ml-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              Join now
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex flex-col md:flex-row xl:px-[8%] items-center justify-between mt-12">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to your professional community
            </h2>
            <div className="space-y-6 max-w-md">
              <GoogleButton text="Continue with Google" />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              <Link
                href="/login"
                className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Sign in with email
              </Link>

              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                By clicking Continue to join or sign in, you agree to YourLogo's{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  User Agreement
                </Link>
                ,{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Placeholder for an illustration or hero image */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Professional illustration
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                YourLogo
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                Accessibility
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                User Agreement
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                Cookie Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:underline dark:text-gray-400"
              >
                Copyright Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
