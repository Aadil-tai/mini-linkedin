"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/lib/validation/auth";
import { supabase } from "@/lib/superbase/client";
import { FormInput } from "@/components/forms/FormInput";
import { FormButton } from "@/components/forms/FormButton";
import { GoogleButton } from "@/components/common/GoogleButton";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { data: signUpResult, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      // Don't redirect immediately - wait for email verification
      setIsEmailSent(true);
    } catch (error: unknown) {
      let errorMessage = "Sign up failed. Please try again.";

      // Handle specific error cases
      if (error && typeof error === "object" && "message" in error) {
        const errorWithMessage = error as { message: string };

        if (errorWithMessage.message.includes("User already registered")) {
          errorMessage =
            "An account with this email already exists. Please sign in instead.";
        } else if (errorWithMessage.message.includes("email address")) {
          errorMessage = "Please enter a valid email address.";
        } else if (errorWithMessage.message.includes("password")) {
          errorMessage = "Password doesn't meet the requirements.";
        } else if (errorWithMessage.message.includes("rate limit")) {
          errorMessage = "Too many signup attempts. Please try again later.";
        } else if (errorWithMessage.message.includes("Email not confirmed")) {
          errorMessage =
            "Please check your email and click the verification link.";
        } else if (errorWithMessage.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else {
          // Show the actual error message for debugging on Vercel
          errorMessage = `Signup failed: ${errorWithMessage.message}`;
        }
      }

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and back link */}

        {/* Main card with glassmorphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Join your community
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Make the most of your professional life
              </p>
            </div>

            {errors.root && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                      {errors.root.message}
                    </span>
                    {/* Show additional debug info on production */}
                    {process.env.NODE_ENV === "production" &&
                      errors.root.message?.includes("Signup failed:") && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-2 rounded">
                          <strong>Debug Info:</strong> If you see this error,
                          please check:
                          <br />
                          1. Your email is valid
                          <br />
                          2. Password meets requirements (8+ chars, uppercase,
                          lowercase, number, special char)
                          <br />
                          3. Supabase site URL is configured correctly
                        </div>
                      )}
                    {errors.root.message?.includes("already exists") && (
                      <div className="mt-1">
                        <Link
                          href="login"
                          className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                        >
                          Sign in to your existing account
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isEmailSent && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Check your email!
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      We've sent you a verification link. Please check your
                      email and click the link to verify your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {!isEmailSent ? (
                <>
                  <div className="space-y-4">
                    <FormInput
                      label="Full Name"
                      type="text"
                      {...register("fullName")}
                      error={errors.fullName}
                      placeholder="Enter your full name"
                    />

                    <FormInput
                      label="Email address"
                      type="email"
                      {...register("email")}
                      error={errors.email}
                      placeholder="Enter your email"
                    />

                    <FormInput
                      label="Password"
                      type="password"
                      {...register("password")}
                      error={errors.password}
                      placeholder="Create a strong password"
                    />

                    <FormInput
                      label="Confirm Password"
                      type="password"
                      {...register("confirmPassword")}
                      error={errors.confirmPassword}
                      placeholder="Confirm your password"
                    />
                  </div>

                  <FormButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>Agree & Join</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    )}
                  </FormButton>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Almost there!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Click the verification link in your email to complete your
                    registration.
                  </p>
                </div>
              )}
            </form>

            {!isEmailSent && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/70 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="transform hover:scale-105 transition-transform duration-300">
                  <GoogleButton />
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already on Mini-LinkedIn?{" "}
                    <Link
                      href="login"
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
