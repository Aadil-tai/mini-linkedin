"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/superbase/client";
import { FormInput } from "@/components/forms/FormInput";
import { FormButton } from "@/components/forms/FormButton";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  /**
   * Step 2: Handle password recovery when user comes back from email link
   * This effect listens for the PASSWORD_RECOVERY event and shows password reset form
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setShowPasswordReset(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    alert("Password updated successfully!");
    router.push("/login");
  };

  const handlePasswordResetCancel = () => {
    setShowPasswordReset(false);
  };

  /**
   * Step 1: Send the user an email to get a password reset token.
   * This email contains a link which sends the user back to your application.
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) throw error;

      setIsEmailSent(true);
      setMessage(
        `Password reset instructions have been sent to ${data.email}. Please check your email and follow the link to reset your password.`
      );
    } catch (error: unknown) {
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send reset email. Please try again.",
      });
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {errors.root && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email address"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            error={errors.email}
          />

          <FormButton type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset instructions"}
          </FormButton>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            href="/(auth)/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Password Reset Form Modal */}
      {showPasswordReset && (
        <PasswordResetForm
          onSuccess={handlePasswordResetSuccess}
          onCancel={handlePasswordResetCancel}
        />
      )}

      {/* Developer Reference Section - Remove in production */}
      <div className=" hidden mt-8 w-full max-w-md p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          🔧 Developer Reference - Password Reset Implementation
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
          <p>
            <strong>Step 1:</strong> Send reset email with{" "}
            <code>resetPasswordForEmail()</code>
          </p>
          <p>
            <strong>Step 2:</strong> Listen for <code>PASSWORD_RECOVERY</code>{" "}
            event in <code>onAuthStateChange</code>
          </p>
          <p>
            <strong>Step 3:</strong> Update password with{" "}
            <code>updateUser()</code>
          </p>
          <p className="text-yellow-600 dark:text-yellow-400">
            Note: In production, replace the prompt() with a proper password
            form.
          </p>
        </div>
      </div>
    </div>
  );
}
