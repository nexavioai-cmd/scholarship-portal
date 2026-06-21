import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://scholarship-portal-coral.vercel.app";

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select("id");

  console.log("SITEMAP DATA:", data?.length);
  console.log("SITEMAP ERROR:", error);

  const scholarshipPages =
    data?.map((item) => ({
      url: `${baseUrl}/scholarships/${item.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...scholarshipPages,
  ];
}