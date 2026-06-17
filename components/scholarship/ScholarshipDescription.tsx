export default function ScholarshipDescription({
  description,
}: {
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Tentang Beasiswa
      </h2>

      <p className="whitespace-pre-line text-gray-600">
        {description}
      </p>
    </div>
  );
}