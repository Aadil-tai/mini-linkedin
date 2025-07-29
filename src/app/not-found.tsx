"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
