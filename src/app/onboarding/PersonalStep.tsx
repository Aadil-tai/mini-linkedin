"use client";

import { Controller } from "react-hook-form";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useState } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { FormInput } from "../components/forms/FormInput";
import { OnboardingFormSchema } from "../lib/schema/onboardingSchema";

interface PersonalStepProps {
  control: Control<OnboardingFormSchema>;
  register: UseFormRegister<OnboardingFormSchema>;
  errors: FieldErrors<OnboardingFormSchema>;
}

export function PersonalStep({ control, register, errors }: PersonalStepProps) {
  const [phone, setPhone] = useState("");

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold">Your personal details</h2>

      <FormInput
        label="First Name"
        {...register("personal.firstName")}
        error={errors.personal?.firstName}
      />

      <FormInput
        label="Last Name"
        {...register("personal.lastName")}
        error={errors.personal?.lastName}
      />

      <FormInput
        label="Email"
        type="email"
        {...register("personal.email")}
        error={errors.personal?.email}
      />

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Phone
        </label>
        <Controller
          name="personal.phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              country="in"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setPhone(value);
              }}
              inputProps={{
                name: field.name,
                onBlur: field.onBlur,
              }}
              containerClass="!w-full"
              inputClass={`
    !w-full !p-2 !pr-10 !rounded-md !border !outline-none
    ${errors.personal?.phone ? "!border-red-500" : "!border-gray-300"}
    focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500
    dark:!bg-gray-800 dark:!text-white dark:!border-gray-600
  `}
              buttonClass="!border-none dark:!bg-gray-700"
            />
          )}
        />
        {errors.personal?.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.personal.phone.message}
          </p>
        )}
      </div>
    </div>
  );
}
