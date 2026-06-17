import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DetailClient from "./DetailClient";

// 1. Generate Metadata untuk SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("scholarships")
    .select("name")
    .eq("id", params.id)
    .single();

  return {
    title: data?.name || "Detail Beasiswa",
  };
}

// 2. Fetch Data di Server dan kirim ke Client
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", params.id)
    .single();

  // Jika data tidak ditemukan, panggil notFound()
  if (error || !data) {
    notFound();
  }

  // 3. Render Client Component dengan membawa initialData
  return (
    <DetailClient
      initialData={data}
    />
  );
}