// components/forms/FormInput.tsx
"use client";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | { message?: string }; // More flexible error type
  containerClass?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, containerClass = "", className = "", ...props }, ref) => {
    return (
      <div className={`space-y-1 ${containerClass}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-md border ${
            error ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${className}`}
          {...props}
        />
        {error?.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
