"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/superbase/client";
import { FormInput } from "@/app/components/forms/FormInput";
import { FormButton } from "@/app/components/forms/FormButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/app/lib/validation/auth";
import { GoogleButton } from "@/app/components/common/GoogleButton";

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
      router.replace("/dashboard");
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Sign up failed. Please try again.",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Make the most of your professional life
        </h1>

        {errors.root && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-100">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email}
          />

          <FormInput
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password}
          />

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            By clicking Agree & Join or Continue, you agree to the LinkedIn{" "}
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

          <FormButton type="submit" isLoading={isSubmitting}>
            Agree & Join
          </FormButton>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              or
            </span>
          </div>
        </div>

        <GoogleButton />

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already on LinkedIn?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
