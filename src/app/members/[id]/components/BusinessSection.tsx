interface BusinessSectionProps {
  about: string;
  businessName: string;
}

export default function BusinessSection({
  about,
  businessName,
}: BusinessSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        My Business
      </h2>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
        {businessName}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
        {about}
      </p>
    </div>
  );
}
