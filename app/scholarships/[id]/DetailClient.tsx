"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import ScholarshipHero from "@/components/scholarship/ScholarshipHero";
import ScholarshipMeta from "@/components/scholarship/ScholarshipMeta";
import ScholarshipDescription from "@/components/scholarship/ScholarshipDescription";
import SimilarScholarships from "@/components/scholarship/SimilarScholarships";

interface Scholarship {
  id: number;
  name: string;
  provider: string;
  country: string;
  level: string;
  funding_type: string;
  deadline: string;
  description?: string;
  image_url?: string;
  official_link?: string;
  minimum_gpa?: string;
}

export default function DetailClient({ initialData }: { initialData: Scholarship }) {
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAuthAndFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("scholarship_id", initialData.id)
          .maybeSingle();
        setIsFavorite(!!data);
      }
    };
    checkAuthAndFavorite();
  }, [initialData.id]);

  const toggleFavorite = async () => {
    if (!user) return toast.error("Silakan login terlebih dahulu");
    setSaving(true);
    try {
      if (isFavorite) {
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("scholarship_id", initialData.id);
        if (error) throw error;
        setIsFavorite(false);
        toast.success("Dihapus dari favorit");
      } else {
        const { error } = await supabase.from("favorites").insert({ user_id: user.id, scholarship_id: initialData.id });
        if (error) throw error;
        setIsFavorite(true);
        toast.success("Berhasil disimpan!");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-6 inline-block text-blue-600 hover:underline">← Kembali ke Daftar</Link>
        
        <ScholarshipHero 
          scholarship={initialData} 
          isFavorite={isFavorite} 
          onToggleFavorite={toggleFavorite}
          saving={saving}
        />
        
        <ScholarshipMeta scholarship={initialData} />
        
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <ScholarshipDescription description={initialData.description || "Tidak ada deskripsi tersedia."} />
          </div>
          <div>
            <SimilarScholarships currentId={initialData.id} country={initialData.country} />
          </div>
        </div>
      </div>
    </main>
  );
}