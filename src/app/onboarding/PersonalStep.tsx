"use client";
import "../../app/style/PhoneInputOverride.css";

import { useEffect, useState } from "react";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { FormInput } from "@/components/forms/FormInput";
import { OnboardingFormSchema } from "@/lib/schema/onboardingSchema";

interface PersonalStepProps {
  control: Control<OnboardingFormSchema>;
  register: UseFormRegister<OnboardingFormSchema>;
  errors: FieldErrors<OnboardingFormSchema>;
  email?: string | null;
  photo?: string | null;
  watch: UseFormWatch<OnboardingFormSchema>;
}

export function PersonalStep({
  control,
  register,
  errors,
  email,
  photo,
  watch,
}: PersonalStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Cleanup function for URL objects
  const cleanupPreviewUrl = (url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  // On mount or photo prop change, set previewUrl from photo prop immediately
  useEffect(() => {
    if (photo) {
      setPreviewUrl(photo);
    }
  }, [photo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviewUrl(previewUrl);
    };
  }, [previewUrl]);

  // Subscribe to watch form photo field and sync previewUrl accordingly
  useEffect(() => {
    const subscription = watch((value) => {
      const photoValue = value.personal?.photo;
      if (!photoValue) {
        setPreviewUrl(null);
      } else if (typeof photoValue === "string") {
        // photo field contains URL string
        setPreviewUrl(photoValue);
      } else if (photoValue instanceof File) {
        // photo field is a File object, create local preview URL
        const url = URL.createObjectURL(photoValue);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    });

    // Cleanup function to unsubscribe from watch
    return () => subscription.unsubscribe();
  }, [watch]);

  // ImgBB image upload handler
  const handleImageUpload = async (
    file: File,
    onChange: (url: string) => void
  ) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success && data.data.url) {
        const imageUrl = data.data.url;
        setPreviewUrl(imageUrl);
        onChange(imageUrl);
      } else {
        console.error("Image upload did not succeed", data);
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold">Your personal details</h2>

      {/* Profile Picture Upload */}
      <Controller
        control={control}
        name="personal.photo"
        render={({ field }) => (
          <div className="flex justify-center">
            <div className="relative group">
              {/* Preview Container */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-md relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">
                    Upload
                  </div>
                )}

                {/* Delete Button */}
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      cleanupPreviewUrl(previewUrl);
                      setPreviewUrl(null);
                      field.onChange(null); // Clear form value
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                    aria-label="Remove Image"
                    title="Remove"
                    disabled={uploading}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Image Picker Input */}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Clean up previous preview URL if it was a blob
                    cleanupPreviewUrl(previewUrl);

                    const localPreview = URL.createObjectURL(file);
                    setPreviewUrl(localPreview); // Instant UI feedback
                    handleImageUpload(file, field.onChange);
                  }
                }}
                disabled={uploading}
                aria-disabled={uploading}
              />
            </div>
          </div>
        )}
      />

      <FormInput
        label="First Name"
        {...register("personal.firstName")}
        error={errors.personal?.firstName}
        required
      />

      <FormInput
        label="Last Name"
        {...register("personal.lastName")}
        error={errors.personal?.lastName}
        required
      />

      <FormInput
        label="Email"
        type="email"
        {...register("personal.email")}
        defaultValue={email ?? ""}
        error={errors.personal?.email}
        readOnly
      />

      {/* Phone Input */}
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
              }}
              inputProps={{
                name: field.name,
                onBlur: field.onBlur,
                "aria-invalid": errors.personal?.phone ? "true" : "false",
              }}
              containerClass="!w-full !relative z-10"
              inputClass={`
                !w-full !pl-14 !pr-10 !py-2 !rounded-md !border !outline-none
                ${
                  errors.personal?.phone
                    ? "!border-red-500"
                    : "!border-gray-300"
                }
                focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500
                dark:!bg-gray-800 dark:!text-white dark:!border-gray-600
              `}
              buttonClass="!absolute !left-0 !top-1/2 !-translate-y-1/2 !h-full !bg-transparent !border-none dark:!bg-transparent z-20"
              dropdownStyle={{ zIndex: 9999 }}
            />
          )}
        />
        {errors.personal?.phone && (
          <p
            className="text-red-500 text-sm mt-1"
            role="alert"
            aria-live="assertive"
          >
            {errors.personal.phone.message}
          </p>
        )}
      </div>
    </div>
  );
}
