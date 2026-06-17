"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FavoriteItem {
  id: number;
  scholarship_id: number;
  scholarships: {
    id: number;
    name: string;
    provider: string;
    country: string;
    level: string;
    funding_type: string;
    deadline: string;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Silakan login untuk melihat favorit");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          scholarship_id,
          scholarships (
            id,
            name,
            provider,
            country,
            level,
            funding_type,
            deadline
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data as unknown as FavoriteItem[] || []);
    } catch (err: any) {
      toast.error("Gagal memuat favorit: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const removeFavorite = async (favoriteId: number) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
      toast.success("Beasiswa dihapus dari favorit");
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message);
    }
  };

  if (loading) return <main className="min-h-screen bg-gray-50 p-10 text-center">Memuat favorit...</main>;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-600 hover:underline">← Kembali ke Beranda</Link>
            <h1 className="mt-3 text-4xl font-bold">My Favorites</h1>
            <p className="text-gray-500">Beasiswa yang telah kamu simpan</p>
          </div>
          <div className="rounded-2xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-500">Total Favorite</p>
            <h2 className="text-3xl font-bold text-pink-600">{favorites.length}</h2>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold">Belum ada favorit</h2>
            <p className="text-gray-500 mt-2">Simpan beasiswa favoritmu dari halaman utama.</p>
            <Link href="/" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
              Jelajahi Beasiswa
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{fav.scholarships.name}</h3>
                  <button onClick={() => removeFavorite(fav.id)} className="text-pink-500 hover:bg-pink-50 p-2 rounded-full">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-6">
                  <p><strong>Provider:</strong> {fav.scholarships.provider}</p>
                  <p><strong>Negara:</strong> {fav.scholarships.country}</p>
                  <p><strong>Level:</strong> {fav.scholarships.level}</p>
                </div>
                <Link href={`/scholarships/${fav.scholarships.id}`} className="block w-full text-center rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                  Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}