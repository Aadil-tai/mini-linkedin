import z from "zod";

export const onboardingSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email").or(z.string().min(1, "Email required")),
    phone: z.string().min(5, "Phone number required"),
    photo: z.union([z.instanceof(File), z.string(), z.null()]).optional(), // Handle File, string URL, or null
  }),
  professional: z.object({
    jobTitle: z.string().min(1, "Job title required"),
    experience: z.string().optional(), // Optional experience field
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