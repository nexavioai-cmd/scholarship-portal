import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

// Mendefinisikan tipe data untuk beasiswa agar rapi
interface SimilarScholarship {
  id: number;
  name: string;
  country: string;
}

export default async function SimilarScholarships({
  currentId,
  country,
}: {
  currentId: number;
  country: string;
}) {
  // Tambahkan 'await' karena fungsi createClient bersifat async
  const supabase = await createClient();

  const { data } = await supabase
    .from("scholarships")
    .select("id, name, country")
    .eq("country", country)
    .neq("id", currentId)
    .limit(3);

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border">
      <h3 className="font-bold text-lg mb-4">Beasiswa Serupa</h3>
      <div className="space-y-3">
        {data.map((item: SimilarScholarship) => (
          <Link
            key={item.id}
            href={`/scholarships/${item.id}`}
            className="block border rounded-xl p-3 hover:bg-gray-50 transition"
          >
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">{item.country}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}