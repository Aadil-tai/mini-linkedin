import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
  UseFormGetValues,
  UseFormStateReturn,
} from "react-hook-form";

// Strict enum for company sizes
export const CompanySize = {
  Small: "Small",
  Medium: "Medium",
  Large: "Large",
} as const;
export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];

// Core domain types
export type PersonalDetails = {
  photo: File | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ProfessionalDetails = {
  jobTitle: string;
  skills: string[];
};

export type CompanyDetails = {
  name: string;
  size: CompanySize;
  industry: string;
};

// Main form contract
export type FormData = {
  personal: PersonalDetails;
  professional: ProfessionalDetails;
  company: CompanyDetails;
};

// Base form step props
export type FormStepProps<T extends FormData = FormData> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  trigger?: UseFormTrigger<T>;
};

// Extended form utilities
export type EnhancedFormStepProps<T extends FormData = FormData> =
  FormStepProps<T> & {
    getValues: UseFormGetValues<T>;
    formState: UseFormStateReturn<T>;
    // Add other utilities as needed
  };

// Helper type for components with form methods
export type WithFormMethods<T extends FormData, P = Record<string, never>> = P & FormStepProps<T>;
