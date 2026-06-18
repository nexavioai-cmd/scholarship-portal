interface Scholarship {
  id: number;
  name: string;
  provider: string;
  funding_type: string;
  image_url?: string;
  official_link?: string;
}

interface Props {
  scholarship: Scholarship;
  isFavorite: boolean;
  saving: boolean;
  onToggleFavorite: () => void;
}

export default function ScholarshipHero({
  scholarship,
  isFavorite,
  saving,
  onToggleFavorite,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-3">
            {scholarship.funding_type}
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            {scholarship.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Diselenggarakan oleh{" "}
            <span className="font-semibold">
              {scholarship.provider}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          {scholarship.official_link && (
            <a
              href={scholarship.official_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Official Website
            </a>
          )}

          <button
            onClick={onToggleFavorite}
            disabled={saving}
            className="px-5 py-3 rounded-xl border font-medium hover:bg-gray-50 transition"
          >
            {saving
              ? "Menyimpan..."
              : isFavorite
              ? "♥ Favorit"
              : "♡ Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}