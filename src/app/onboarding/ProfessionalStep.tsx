"use client";

import { FormInput } from "@/components/forms/FormInput";
import { OnboardingFormSchema } from "@/lib/schema/onboardingSchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { X, Plus, Briefcase } from "lucide-react";

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
    <div className="space-y-6">
      {/* Enhanced Header - Hidden since it's shown in parent */}
      {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your role
      </h2> */}

      {/* Two-Column Layout for Job Title and Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="space-y-2">
          <FormInput
            label="Job Title"
            {...register("professional.jobTitle")}
            error={errors.professional?.jobTitle}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            placeholder="e.g., Software Engineer, Product Manager"
          />
        </div>

        {/* Years of Experience - New Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <select
            {...register("professional.experience")}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="">Select experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
          {errors.professional?.experience && (
            <p className="text-red-500 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.professional.experience.message}
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Skills Section - Full Width */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Skills & Expertise
          </label>
        </div>

        {/* Enhanced Skill Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              placeholder="e.g., JavaScript, React, Python, Project Management..."
              aria-label="Add skill"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 rounded border">
                Enter
              </kbd>
            </div>
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 transform flex items-center gap-2"
            aria-label="Add skill"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {errors.professional?.skills && (
          <p className="text-red-500 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.professional.skills.message}
          </p>
        )}

        {/* Enhanced Skills Display */}
        {skills.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Added Skills ({skills.length})
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Click × to remove</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={skill}
                  className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-700/50 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-800/40 dark:hover:to-teal-800/40 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-sm font-medium">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="flex items-center justify-center w-5 h-5 text-emerald-600 dark:text-emerald-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all duration-200 group-hover:scale-110"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Suggestions */}
        {skills.length === 0 && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2 font-medium">
              💡 Popular skills to consider:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "JavaScript",
                "React",
                "Python",
                "Project Management",
                "Leadership",
                "Communication",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setCurrentSkill(suggestion)}
                  className="px-3 py-1 text-xs bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
