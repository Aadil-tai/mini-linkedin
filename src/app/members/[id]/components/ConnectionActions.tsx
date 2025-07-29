interface ConnectionActionsProps {
  contactInfo: {
    location: string;
    personalPhone: string;
    professionalPhone: string;
    email: string;
    website: string;
  };
}

export default function ConnectionActions({
  contactInfo,
}: ConnectionActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Connection
        </h2>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
            Disconnect
          </button>
          <button className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg transition">
            Message
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          Contact Information
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">📍</span>
            <span>{contactInfo.location}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📱</span>
            <span>{contactInfo.personalPhone}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📞</span>
            <span>{contactInfo.professionalPhone}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✉️</span>
            <span>{contactInfo.email}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🌐</span>
            <a
              href={contactInfo.website}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {contactInfo.website}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
