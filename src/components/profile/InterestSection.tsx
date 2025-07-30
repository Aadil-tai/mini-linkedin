interface InterestsSectionProps {
  skills: string[];
  asks: string[];
  gives: string[];
  events: string[];
}

export default function InterestsSection({
  skills,
  asks,
  gives,
  events,
}: InterestsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        My Interests
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            My Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            My Ask
          </h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
            {asks.map((ask, index) => (
              <li key={index}>{ask}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            My Gives
          </h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
            {gives.map((give, index) => (
              <li key={index}>{give}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            Events Attending
          </h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
