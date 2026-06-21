import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://scholarship-portal-coral.vercel.app";

  const supabase = await createClient();

  const { data } = await supabase
    .from("scholarships")
    .select("id, updated_at");

  const scholarshipPages =
    data?.map((item) => ({
      url: `${baseUrl}/scholarships/${item.id}`,
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

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