import z from "zod";

export const onboardingSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email").nullable(),
    phone: z.string().min(5, "Phone number required"),
    photo: z.instanceof(File).nullable().optional(), // 👈 match the File | null type
  }),
  professional: z.object({
    jobTitle: z.string().min(1, "Job title required"),
    skills: z.array(z.string()).min(1, "Add at least one skill"),
  }),
  company: z.object({
    name: z.string().min(1, "Company name required"),
    size: z.string().min(1, "Select company size"),
    industry: z.string().min(1, "Industry required"),
  }),
});

// Add this line to export the inferred type
export type OnboardingFormSchema = z.infer<typeof onboardingSchema>;
