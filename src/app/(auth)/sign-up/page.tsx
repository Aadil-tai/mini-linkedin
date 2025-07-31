"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/lib/validation/auth";
import { supabase } from "@/lib/superbase/client";
import { FormInput } from "@/components/forms/FormInput";
import { FormButton } from "@/components/forms/FormButton";
import { GoogleButton } from "@/components/common/GoogleButton";

export default function SignUpPage() {
  const router = useRouter();
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
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;
      setIsEmailSent(true);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Sign up failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 flex items-center justify-center p-4">
      {/* Background elements remain unchanged */}
      <div className="relative w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/50 dark:border-gray-700/50 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Join your community
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Make the most of your professional life
              </p>
            </div>

            {/* Error and success messages with adjusted text sizes */}
            {errors.root && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /* ... */
                  />
                  <span className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
                    {errors.root.message}
                  </span>
                </div>
              </div>
            )}

            {isEmailSent && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" /* ... */
                  />
                  <div>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Check your email!
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                      We've sent a verification link to your email.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {!isEmailSent ? (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    <FormInput
                      label="Full Name"
                      type="text"
                      {...register("fullName")}
                      error={errors.fullName}
                      placeholder="Enter your full name"
                      className="text-sm sm:text-base"
                    />
                    {/* Other FormInputs with same className adjustment */}
                  </div>

                  <FormButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full py-2 sm:py-3 text-sm sm:text-base"
                  >
                    {isSubmitting ? "Creating account..." : "Agree & Join"}
                  </FormButton>
                </>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" /* ... */
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    Almost there!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Click the verification link in your email.
                  </p>
                </div>
              )}
            </form>

            {!isEmailSent && (
              <>
                <div className="relative my-6 sm:my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-2 sm:px-4 bg-white/70 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="transform hover:scale-105 transition-transform duration-300">
                  <GoogleButton />
                </div>

                <div className="mt-6 sm:mt-8 text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Already on Mini-LinkedIn?{" "}
                    <Link
                      href="/(auth)/login"
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline text-xs sm:text-sm"
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
