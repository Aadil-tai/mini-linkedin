// components/WebinarCard.tsx
export default function WebinarCard() {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-3">
        Community Choice Webinar 2025
      </h2>
      <p className="text-gray-600 mb-4">
        What should we advert in our upcoming webinar?
      </p>

      <div className="space-y-3">
        <div className="p-3 border rounded-lg hover:bg-blue-50 transition-colors">
          <h3 className="font-medium">Future of J4 & AI</h3>
          <p className="text-sm text-gray-500 mt-1">36g</p>
        </div>

        <div className="p-3 border rounded-lg hover:bg-blue-50 transition-colors">
          <h3 className="font-medium">Digital Marketing Trends</h3>
        </div>
      </div>
    </section>
  );
}
