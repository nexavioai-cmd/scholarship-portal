5. components/scholarship/ScholarshipHero.tsx

Kode bekerja.

Tapi Anda memakai:

export default function ScholarshipHero({
  scholarship,
  isFavorite,
  onToggleFavorite,
  saving
}: any)

❌ Jangan pakai any.

Buat type.

interface Scholarship {
  id: number;
  name: string;
  provider: string;
  funding_type: string;
  image_url?: string;
  official_link?: string;
}

Lalu:

interface Props {
  scholarship: Scholarship;
  isFavorite: boolean;
  saving: boolean;
  onToggleFavorite: () => void;
}

Kemudian:

export default function ScholarshipHero({
  scholarship,
  isFavorite,
  saving,
  onToggleFavorite,
}: Props)

Lebih aman dan rapi.

6. components/scholarship/ScholarshipMeta.tsx

Sekarang:

export default function ScholarshipMeta({
 scholarship
}: any)

❌ Ganti dengan interface.

interface Scholarship {
  country: string;
  level: string;
  deadline: string;
  minimum_gpa?: string;
}

Lalu:

export default function ScholarshipMeta({
 scholarship
}: {
 scholarship: Scholarship;
})
7. components/scholarship/SimilarScholarships.tsx

Ini bagian yang bermasalah.

Sekarang:

import { supabase } from "@/lib/supabase";

lalu

export default async function SimilarScholarships()

❌ Salah.

Karena:

supabase.ts

adalah Browser Client.

Sedangkan:

async function Component()

berarti Server Component.

Harusnya:

import { createClient } from "@/lib/supabase-server";

lalu:

const supabase = await createClient();

Contoh:

import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function SimilarScholarships({
  currentId,
  country,
}: {
  currentId: number;
  country: string;
}) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("scholarships")
    .select("id,name")
    .eq("country", country)
    .neq("id", currentId)
    .limit(3);

  if (!data?.length) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm">
      <h3 className="font-bold mb-4">
        Beasiswa Serupa
      </h3>

      {data.map((item) => (
        <Link
          key={item.id}
          href={`/scholarships/${item.id}`}
          className="block border rounded-lg p-3 mb-2 hover:bg-gray-50"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}