interface ProfileHeaderProps {
  name: string;
  title: string;
  businessName: string;
}

export default function ProfileHeader({
  name,
  title,
  businessName,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {/* Avatar placeholder - replace with actual avatar */}
          <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
            {name.charAt(0)}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-gray-500 dark:text-gray-400">{businessName}</p>
        </div>
      </div>
    </div>
  );
}
