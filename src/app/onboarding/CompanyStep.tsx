"use client";

import { FormInput } from "@/components/forms/FormInput";
import { OnboardingFormSchema } from "@/lib/schema/onboardingSchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface CompanyStepProps {
  control: Control<OnboardingFormSchema>;
  register: UseFormRegister<OnboardingFormSchema>;
  errors: FieldErrors<OnboardingFormSchema>;
}

export const CompanyStep = ({ register, errors }: CompanyStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Company details
      </h2>

      <FormInput
        label="Company Name"
        {...register("company.name")}
        error={errors.company?.name}
        className="text-black dark:text-white"
      />

      {/* Company Size */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Company Size
        </label>
        <div className="flex gap-4">
          {(["Small", "Medium", "Large"] as const).map((size) => (
            <label
              key={size}
              className="flex items-center text-black dark:text-gray-200"
            >
              <input
                type="radio"
                value={size}
                {...register("company.size")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600"
              />
              <span className="ml-2">{size}</span>
            </label>
          ))}
        </div>
        {errors.company?.size && (
          <p className="text-red-500 text-sm mt-1">
            {errors.company.size.message}
          </p>
        )}
      </div>

      <FormInput
        label="Industry"
        {...register("company.industry")}
        error={errors.company?.industry}
        className="text-black dark:text-white"
      />
    </div>
  );
};
