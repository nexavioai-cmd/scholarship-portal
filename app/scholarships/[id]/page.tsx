import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase-server";
import DetailClient from "./DetailClient";
import SimilarScholarships from "@/components/scholarship/SimilarScholarships";

type Props = {
  params: Promise<{ id: string }>;
};

const getScholarship = cache(async (id: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data;
});

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const scholarship = await getScholarship(Number(id));

  if (!scholarship) {
    return {
      title: "Scholarship Not Found",
    };
  }

  return {
    title: scholarship.name,
    description:
      scholarship.description ||
      `${scholarship.name} scholarship by ${scholarship.provider}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const scholarship = await getScholarship(Number(id));

  if (!scholarship) {
    notFound();
  }

  return (
    <DetailClient initialData={scholarship}>
      <SimilarScholarships
        currentId={scholarship.id}
        country={scholarship.country}
      />
    </DetailClient>
  );
}