interface Scholarship {
  id: number;
  name: string;
  provider: string;
  country: string;
  level: string;
  funding_type: string;
  deadline: string;
  description?: string;
  image_url?: string;
  official_link?: string;
  minimum_gpa?: number | string;
}

export default function DetailClient({
  initialData,
  children,
}: {
  initialData: Scholarship;
  children: React.ReactNode;
}) {
  const displayDescription =
    initialData.description?.trim() ||
    `${initialData.name} adalah ${initialData.funding_type} scholarship di ${initialData.country} untuk level ${initialData.level}. Diselenggarakan oleh ${initialData.provider}. Deadline pendaftaran ${initialData.deadline}.`;

  return (
    <>
      <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Tentang Beasiswa
        </h2>

        <p className="whitespace-pre-line text-gray-600">
          {displayDescription}
        </p>
      </div>

      {children}
    </>
  );
}