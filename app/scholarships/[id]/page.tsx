import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase-server";
import DetailClient from "./DetailClient";
import SimilarScholarships from "@/components/scholarship/SimilarScholarships";

export interface ScholarshipSEO {
  id: number;
  name: string;
  provider: string;
  country: string;
  level: string;
  funding_type: string;
  deadline: string;
  description?: string | null;
  image_url?: string | null;
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const getScholarship = cache(async (id: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
});

function buildDescription(s: ScholarshipSEO) {
  if (s.description && s.description.trim().length > 0) {
    return s.description;
  }

  return `${s.name} adalah ${s.funding_type} scholarship di ${s.country} untuk level ${s.level}. Diselenggarakan oleh ${s.provider}. Deadline pendaftaran ${s.deadline}.`;
}

function buildMetaDescription(s: ScholarshipSEO) {
  const text = buildDescription(s);

  return text.length > 160
    ? `${text.slice(0, 157)}...`
    : text;
}

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

  const description = buildMetaDescription(scholarship);

  const image =
    scholarship.image_url ||
    "https://scholarship-portal-coral.vercel.app/og-image.png";

  return {
    title: scholarship.name,

    description,

    alternates: {
      canonical: `/scholarships/${scholarship.id}`,
    },

    openGraph: {
      title: scholarship.name,
      description,
      url: `https://scholarship-portal-coral.vercel.app/scholarships/${scholarship.id}`,
      siteName: "Scholarship Hub",
      locale: "id_ID",
      type: "article",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: scholarship.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: scholarship.name,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const scholarship = await getScholarship(Number(id));

  if (!scholarship) {
    notFound();
  }

  const scholarshipWithDescription = {
    ...scholarship,
    description: buildDescription(scholarship),
  };

  return (
    <DetailClient initialData={scholarshipWithDescription}>
      <SimilarScholarships
        currentId={scholarship.id}
        country={scholarship.country}
      />
    </DetailClient>
  );
}