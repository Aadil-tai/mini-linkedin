"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Building2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { CompanyStep } from "./CompanyStep";
import { ProfessionalStep } from "./ProfessionalStep";
import { PersonalStep } from "./PersonalStep";
import {
  OnboardingFormSchema,
  onboardingSchema,
} from "@/lib/schema/onboardingSchema";
import { FormButton } from "@/components/forms/FormButton";
import { supabase } from "@/lib/superbase/client";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [currentSkill, setCurrentSkill] = useState("");

  // Initialize the form hooks here before useEffect!
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

  // User info state for displaying email, photo, fullName etc.
  const [userInfo, setUserInfo] = useState<{
    email: string | null;
    photo: string | null;
    fullName: string | null;
  }>({
    email: null,
    photo: null,
    fullName: null,
  });

  // Fetch current user and pre-fill form values as soon as useForm is ready
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
        setValue("personal.photo", user.user_metadata?.avatar_url ?? "");
        setValue(
          "personal.firstName",
          user.user_metadata?.full_name || user.user_metadata?.name || ""
        );
      }
    }
    fetchUser();
  }, [setValue]);

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

    if (fields && (await trigger(fields as any))) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data: OnboardingFormSchema) => {
    console.log("Form submitted", data);
    // TODO: Save onboarding data to your database here, e.g., supabase.from('profiles').update(...)
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="lg:w-1/3 bg-blue-800 text-white p-8 hidden lg:flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Convertico</h1>

        <div className="space-y-4 flex-1">
          {[
            { icon: <User className="mr-3" />, label: "Personal Details" },
            { icon: <Building2 className="mr-3" />, label: "Company Info" },
            { icon: <Briefcase className="mr-3" />, label: "Your Role" },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                step === index + 1 ? "bg-blue-700" : "hover:bg-blue-700/50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-blue-200 mt-auto">
          All rights reserved @Convertico
        </p>
      </div>

      {/* Form Content */}
      <div className="lg:w-2/3 p-6 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          {step === 1 && (
            <PersonalStep
              control={control}
              register={register}
              errors={errors}
              email={userInfo.email}
              photo={userInfo.photo}
              watch={watch} // pass watch if PersonalStep needs it
            />
          )}

          {step === 2 && (
            <CompanyStep
              control={control}
              register={register}
              errors={errors}
            />
          )}

          {step === 3 && (
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
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <FormButton
                type="button"
                onClick={prevStep}
                variant="outline"
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </FormButton>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <FormButton
                type="button"
                onClick={nextStep}
                disabled={!isValid}
                iconRight={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </FormButton>
            ) : (
              <FormButton type="submit" disabled={!isValid}>
                Submit
              </FormButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
