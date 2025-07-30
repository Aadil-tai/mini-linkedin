"use client";

import { FormInput } from "@/components/forms/FormInput";
import { OnboardingFormSchema } from "@/lib/schema/onboardingSchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface ProfessionalStepProps {
  control: Control<OnboardingFormSchema>;
  register: UseFormRegister<OnboardingFormSchema>;
  errors: FieldErrors<OnboardingFormSchema>;
  setCurrentSkill: (value: string) => void;
  currentSkill: string;
  addSkill: () => void;
  removeSkill: (skill: string) => void;
  skills: string[];
}

export const ProfessionalStep = ({
  register,
  errors,
  currentSkill,
  setCurrentSkill,
  addSkill,
  removeSkill,
  skills,
}: ProfessionalStepProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Your role
      </h2>

      <FormInput
        label="Job Title"
        {...register("professional.jobTitle")}
        error={errors.professional?.jobTitle}
        className="text-black dark:text-white"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Skills
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              bg-white text-black border-gray-300
              dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Add a skill"
            aria-label="Add skill"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-gray-800 
              dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-white rounded-lg transition-colors"
            aria-label="Add skill"
          >
            Add
          </button>
        </div>

        {errors.professional?.skills && (
          <p className="text-red-500 text-sm mt-1">
            {errors.professional.skills.message}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 
                  dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-3 py-1 rounded-full transition-colors"
              >
                <span className="text-sm">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
