"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        scholarship_id,
        scholarships (*)
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("FAVORITES ERROR:", error);
    } else {
      setFavorites(data || []);
    }

    setLoading(false);
  };

  const removeFavorite = async (
    favoriteId: number
  ) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);

    if (error) {
      console.error(error);
      return;
    }

    setFavorites((prev) =>
      prev.filter((item) => item.id !== favoriteId)
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-blue-600 hover:underline"
            >
              ← Kembali
            </Link>

            <h1 className="mt-3 text-4xl font-bold">
              My Favorites
            </h1>

            <p className="text-gray-500">
              Beasiswa yang telah kamu simpan
            </p>
          </div>

          <div className="rounded-2xl bg-white px-6 py-4 shadow">
            <p className="text-sm text-gray-500">
              Total Favorite
            </p>

            <h2 className="text-3xl font-bold text-pink-600">
              {favorites.length}
            </h2>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <div className="text-5xl">
              ❤️
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Belum ada favorite
            </h2>

            <p className="mt-2 text-gray-500">
              Simpan beasiswa favoritmu dari halaman utama.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Jelajahi Beasiswa
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((favorite) => {
              const item = favorite.scholarships;

              return (
                <div
                  key={favorite.id}
                  className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">

                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    <button
                      onClick={() =>
                        removeFavorite(favorite.id)
                      }
                      className="text-2xl"
                    >
                      ❤️
                    </button>

                  </div>

                  <div className="space-y-2 text-sm text-gray-700">

                    <p>
                      <strong>Provider:</strong>{" "}
                      {item.provider || "-"}
                    </p>

                    <p>
                      <strong>Country:</strong>{" "}
                      {item.country || "-"}
                    </p>

                    <p>
                      <strong>Level:</strong>{" "}
                      {item.level || "-"}
                    </p>

                    <p>
                      <strong>Funding:</strong>{" "}
                      {item.funding_type || "-"}
                    </p>

                    <p>
                      <strong>Deadline:</strong>{" "}
                      {item.deadline || "-"}
                    </p>

                  </div>

                  <Link
                    href={`/scholarships/${item.id}`}
                    className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                  >
                    Lihat Detail
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}