// components/forms/FormButton.tsx
interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: "default" | "outline";
  isLoading?: boolean; // Add this line
}
// Add this import at the top of your onboarding page
import { Loader2 } from "lucide-react";
export const FormButton = ({
  children,
  icon,
  iconRight,
  className = "",
  variant = "default",
  isLoading = false, // Add default value
  ...props
}: FormButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        variant === "outline"
          ? "border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
      } ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" /> // Using Lucide's Loader2
      ) : (
        <>
          {icon}
          {children}
          {iconRight}
        </>
      )}
    </button>
  );
};
