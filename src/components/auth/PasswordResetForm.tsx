"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { FormInput } from "@/components/forms/FormInput";
import { FormButton } from "@/components/forms/FormButton";

// Validation schema for new password
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface PasswordResetFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PasswordResetForm({
  onSuccess,
  onCancel,
}: PasswordResetFormProps) {
  // Create supabase client
  const supabase = createBrowserSupabase();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      onSuccess();
    } catch (error: unknown) {
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update password. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Set New Password
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please enter your new password below.
        </p>

        {errors.root && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100 mb-4">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            {...register("password")}
            error={errors.password}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />

          <div className="flex space-x-3 pt-4">
            <FormButton
              type="submit"
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </FormButton>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
