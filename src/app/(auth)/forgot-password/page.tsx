"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { FormInput } from "@/components/forms/FormInput";
import { FormButton } from "@/components/forms/FormButton";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

// ✅ Zod schema for form validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [message, setMessage] = useState("");

  // Create supabase client
  const supabase = createBrowserSupabase();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // ✅ Step 2: Listen for PASSWORD_RECOVERY event
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "PASSWORD_RECOVERY") {
        setShowPasswordReset(true);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // ✅ Password reset success & cancel
  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    alert("Password updated successfully!");
    router.push("/login");
  };

  const handlePasswordResetCancel = () => {
    setShowPasswordReset(false);
  };

  // ✅ Step 1: Send reset email using Supabase built-in service
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? "https://mini-linkedin.vercel.app/(auth)/forgot-password"
          : `${window.location.origin}/(auth)/forgot-password`;

      console.log("Attempting to send reset email to:", data.email);
      console.log("Redirect URL:", redirectUrl);

      // TEMPORARY: Skip email for testing (remove this in production)
      if (
        process.env.NODE_ENV === "development" &&
        data.email === "test@example.com"
      ) {
        console.log("🧪 TEST MODE: Skipping actual email send");
        setIsEmailSent(true);
        setMessage(
          `TEST MODE: Password reset would be sent to ${data.email}. Check Supabase Dashboard to fix email configuration.`
        );
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Supabase reset email error:", error);
        throw error;
      }

      console.log("Reset email sent successfully");

      // ✅ Always show success message for security
      setIsEmailSent(true);
      setMessage(
        `If an account with ${data.email} exists, we've sent password reset instructions. Please check your email (including spam folder).`
      );
    } catch (err: unknown) {
      console.error("Full error details:", err);

      let errorMessage = "Failed to send reset email. Please try again.";

      if (err instanceof Error) {
        // Provide more specific error messages
        if (err.message.includes("rate limit")) {
          errorMessage =
            "Too many reset attempts. Please wait before trying again.";
        } else if (err.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (err.message.includes("Error sending recovery email")) {
          errorMessage =
            "⚠️ Email service configuration issue. Please contact support or try again later.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }

      setError("root", { type: "manual", message: errorMessage });
    }
  };

  // ✅ Show confirmation screen after sending email
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

  // ✅ Default Forgot Password Form
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

            {/* Show helpful debugging info for email configuration issues */}
            {errors.root.message?.includes("Email service configuration") && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer font-medium">
                  🔧 Troubleshooting Steps
                </summary>
                <div className="mt-2 bg-red-50 dark:bg-red-800/50 p-2 rounded">
                  <p className="font-medium mb-1">Check Supabase Dashboard:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Go to Authentication → Settings → SMTP Settings</li>
                    <li>
                      Either disable custom SMTP (use Supabase built-in) OR
                    </li>
                    <li>Configure your SMTP provider properly</li>
                    <li>Check Email Templates have correct redirect URLs</li>
                    <li>Verify sender email is authenticated</li>
                  </ul>
                  <p className="mt-2 text-yellow-700 dark:text-yellow-300">
                    💡 Tip: Try disabling custom SMTP first to use Supabase's
                    built-in email service
                  </p>
                </div>
              </details>
            )}
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
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* ✅ Password Reset Form when user clicks email link */}
      {showPasswordReset && (
        <PasswordResetForm
          onSuccess={handlePasswordResetSuccess}
          onCancel={handlePasswordResetCancel}
        />
      )}
    </div>
  );
}
