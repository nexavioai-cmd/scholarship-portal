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
    <div className="mb-8">
      <h1>{scholarship.name}</h1>
      <button onClick={onToggleFavorite} disabled={saving}>
        {isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
      </button>
    </div>
  );
}