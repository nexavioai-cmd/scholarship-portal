import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DetailClient from "./DetailClient";
import SimilarScholarships from "@/components/scholarship/SimilarScholarships";

// 1. Generate Metadata untuk SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("scholarships")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: data?.name || "Detail Beasiswa",
  };
}

// 2. Server Component Page
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch data
  const { data: scholarship, error } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !scholarship) {
    notFound();
  }

  // 3. Render DetailClient dengan SimilarScholarships sebagai children
  return (
    <DetailClient initialData={scholarship}>
      {/* SimilarScholarships adalah Server Component 
        yang berjalan di sisi server dan disuntikkan ke Client Component
      */}
      <SimilarScholarships 
        currentId={scholarship.id} 
        country={scholarship.country} 
      />
    </DetailClient>
  );
}