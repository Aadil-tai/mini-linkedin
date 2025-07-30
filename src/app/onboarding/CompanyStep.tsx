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
      {/* Enhanced Header - Hidden since it's shown in parent */}
      {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Company details
      </h2> */}

      {/* Two-Column Layout for Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="space-y-2">
          <FormInput
            label="Company Name"
            {...register("company.name")}
            error={errors.company?.name}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            placeholder="Enter your company name"
          />
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <FormInput
            label="Industry"
            {...register("company.industry")}
            error={errors.company?.industry}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            placeholder="e.g., Technology, Healthcare, Finance"
          />
        </div>
      </div>

      {/* Company Size - Enhanced Full Width Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company Size
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["Small", "Medium", "Large"] as const).map((size) => (
            <label
              key={size}
              className="relative flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
            >
              <input
                type="radio"
                value={size}
                {...register("company.size")}
                className="sr-only peer"
              />

              {/* Custom Radio Button */}
              <div className="absolute left-4 w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full transition-all duration-200 peer-checked:border-purple-500 peer-checked:bg-purple-500 group-hover:border-purple-400">
                <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-full transition-all duration-200 peer-checked:bg-purple-500"></div>
              </div>

              {/* Size Labels with Descriptions */}
              <div className="flex-1 ml-8 text-left">
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                  {size}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {size === "Small" && "1-50 employees"}
                  {size === "Medium" && "51-500 employees"}
                  {size === "Large" && "500+ employees"}
                </div>
              </div>

              {/* Selected State Indicator */}
              <div className="absolute inset-0 border-2 border-transparent rounded-xl peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/30 transition-all duration-200"></div>
            </label>
          ))}
        </div>

        {errors.company?.size && (
          <p className="text-red-500 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.company.size.message}
          </p>
        )}
      </div>
    </div>
  );
};
