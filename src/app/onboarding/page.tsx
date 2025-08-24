"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Target,
  Rocket,
} from "lucide-react";

import { CompanyStep } from "./CompanyStep";
import { ProfessionalStep } from "./ProfessionalStep";
import { PersonalStep } from "./PersonalStep";
import {
  OnboardingFormSchema,
  onboardingSchema,
} from "@/lib/schema/onboardingSchema";
import { FormButton } from "@/components/forms/FormButton";
import { supabase } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/profileAction";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [currentSkill, setCurrentSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const router = useRouter();

  // Clean up URL hash on component mount
  useEffect(() => {
    if (window.location.hash) {
      const url = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", url);
    }
  }, []);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<OnboardingFormSchema>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      professional: { skills: [] },
      personal: { photo: null },
    },
  });

  const [userInfo, setUserInfo] = useState<{
    email: string | null;
    photo: string | null;
    fullName: string | null;
  }>({
    email: null,
    photo: null,
    fullName: null,
  });

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserInfo({
          email: user.email ?? null,
          photo: user.user_metadata?.avatar_url || null,
          fullName:
            user.user_metadata?.full_name || user.user_metadata?.name || "",
        });

        setValue("personal.email", user.email ?? "");
        setValue("personal.photo", user.user_metadata?.avatar_url ?? null);
        setValue(
          "personal.firstName",
          user.user_metadata?.full_name || user.user_metadata?.name || ""
        );

        setTimeout(() => {
          trigger(["personal.email", "personal.firstName"]);
        }, 100);
      }
    }
    fetchUser();
  }, [setValue, trigger]);

  const skills = watch("professional.skills") || [];

  const addSkill = () => {
    const trimmedSkill = currentSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setValue("professional.skills", [...skills, trimmedSkill]);
      setCurrentSkill("");
      trigger("professional.skills");
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      "professional.skills",
      skills.filter((s) => s !== skill)
    );
  };

  const nextStep = async () => {
    const fields = {
      1: [
        "personal.firstName",
        "personal.lastName",
        "personal.email",
        "personal.phone",
      ],
      2: ["company.name", "company.size", "company.industry"],
      3: ["professional.jobTitle", "professional.skills"],
    }[step];

    if (fields) {
      const isStepValid = await trigger(
        fields as (keyof OnboardingFormSchema)[]
      );
      if (isStepValid) {
        setCompletedSteps((prev) => [...prev.filter((s) => s !== step), step]);
        setStep((prev) => Math.min(prev + 1, 3));
      }
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: OnboardingFormSchema) => {
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const error = await updateProfile(user.id, data);

      if (error) {
      } else {
        router.replace("/feed");
      }
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepInfo = [
    {
      icon: <User className="w-6 h-6" />,
      label: "Personal Details",
      description: "Tell us about yourself",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      label: "Company Info",
      description: "Your workplace details",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: "Professional Role",
      description: "Your skills & expertise",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  const progressPercentage = ((step - 1) / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Enhanced Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
          {/* Sidebar background with glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative h-full p-8 lg:p-12 flex flex-col text-white">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">ML</span>
                </div>
                <h1 className="text-2xl font-bold">Mini-LinkedIn</h1>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                  Welcome to your
                  <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                    professional journey
                  </span>
                </h2>
                <p className="text-blue-100 text-lg">
                  Let's set up your profile in just a few steps
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-blue-100">Progress</span>
                <span className="font-semibold">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 flex-1">
              {stepInfo.map((item, index) => {
                const stepNumber = index + 1;
                const isActive = step === stepNumber;
                const isCompleted = completedSteps.includes(stepNumber);

                return (
                  <div
                    key={item.label}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm scale-105 shadow-xl"
                        : isCompleted
                        ? "bg-white/10 backdrop-blur-sm"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center p-4 lg:p-6">
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-white text-blue-600 shadow-lg scale-110"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-white/20 text-white group-hover:bg-white/30"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          item.icon
                        )}
                        {isActive && (
                          <div className="absolute -inset-1 bg-white/50 rounded-xl animate-pulse"></div>
                        )}
                      </div>

                      <div className="ml-4 flex-1">
                        <h3
                          className={`font-semibold transition-colors ${
                            isActive ? "text-white" : "text-blue-100"
                          }`}
                        >
                          {item.label}
                        </h3>
                        <p className="text-sm text-blue-200 mt-1">
                          {item.description}
                        </p>
                      </div>

                      {isActive && (
                        <div className="ml-2">
                          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Active step glow effect */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom motivation */}
          </div>
        </div>

        {/* Enhanced Form Content - Full width on mobile */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl">
            {/* Mobile Header with Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ML</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mini-LinkedIn
                </h1>
              </div>

              {/* Mobile Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Step {step} of 3
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="hidden lg:inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Step {step} of 3
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stepInfo[step - 1].label}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                {stepInfo[step - 1].description}
              </p>
            </div>

            {/* Form Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/50 dark:border-gray-700/50 shadow-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                  }}
                  className="space-y-6"
                  noValidate
                >
                  {/* Two-column form content */}
                  <div className="min-h-[300px] relative">
                    {step === 1 && (
                      <div className="transition-all duration-500 opacity-100 translate-x-0">
                        <PersonalStep
                          control={control}
                          register={register}
                          errors={errors}
                          email={userInfo.email}
                          photo={userInfo.photo}
                          watch={watch}
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="transition-all duration-500 opacity-100 translate-x-0">
                        <CompanyStep
                          control={control}
                          register={register}
                          errors={errors}
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="transition-all duration-500 opacity-100 translate-x-0">
                        <ProfessionalStep
                          control={control}
                          register={register}
                          errors={errors}
                          currentSkill={currentSkill}
                          setCurrentSkill={setCurrentSkill}
                          addSkill={addSkill}
                          removeSkill={removeSkill}
                          skills={skills}
                        />
                      </div>
                    )}
                  </div>

                  {/* Enhanced Navigation */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    {step > 1 ? (
                      <FormButton
                        type="button"
                        onClick={prevStep}
                        className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </FormButton>
                    ) : (
                      <div></div>
                    )}

                    {step < 3 ? (
                      <FormButton
                        type="button"
                        onClick={nextStep}
                        className="flex items-center space-x-2 px-6 sm:px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform text-sm sm:text-base"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </FormButton>
                    ) : (
                      <FormButton
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="flex items-center space-x-2 px-6 sm:px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">
                              Creating Profile...
                            </span>
                            <span className="sm:hidden">Creating...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              Complete Setup
                            </span>
                            <span className="sm:hidden">Complete</span>
                          </>
                        )}
                      </FormButton>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span>Quick Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                <span>Personalized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
