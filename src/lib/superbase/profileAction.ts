// lib/supabase/profileActions.ts
import { supabase } from "@/lib/superbase/client";
import type { OnboardingFormSchema } from "@/lib/schema/onboardingSchema";

export async function updateProfile(
  user_id: string,
  formData: OnboardingFormSchema
) {
  console.log("updateProfile called with:", { user_id, formData });

  // First, check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  console.log("Existing profile check:", { existingProfile, fetchError });

  // Map form data to your database columns
  const updateData = {
    avatar_url:
      typeof formData.personal.photo === "string"
        ? formData.personal.photo
        : null,
    first_name: formData.personal.firstName,
    last_name: formData.personal.lastName,
    email: formData.personal.email ?? "",
    phone: formData.personal.phone,
    job_title: formData.professional.jobTitle,
    skills: formData.professional.skills,
    company: formData.company.name,
    company_size: formData.company.size,
    industry: formData.company.industry,
    updated_at: new Date().toISOString(),
  };

  console.log("Update data:", updateData);

  // If profile doesn't exist, create it
  if (fetchError && fetchError.code === 'PGRST116') {
    console.log("Profile doesn't exist, creating new one...");
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user_id,
        user_id: user_id,
        ...updateData,
        created_at: new Date().toISOString(),
      });
    
    console.log("Insert result:", { insertError });
    return insertError;
  }

  // Update existing profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user_id);

  console.log("Update result:", { updateError });
  return updateError;
}
