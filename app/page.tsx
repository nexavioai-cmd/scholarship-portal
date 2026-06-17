"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [fundingFilter, setFundingFilter] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("deadline_asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;

      setUser(session?.user ?? null);

      if (session?.user) {
        loadScholarships();
        loadFavorites();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        loadScholarships();
        loadFavorites();
      } else {
        setScholarships([]);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, countryFilter, levelFilter, fundingFilter, sortBy]);

  const loadScholarships = async () => {
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .order("deadline", { ascending: true });

    if (error) {
      console.error("LOAD ERROR:", error);
    } else {
      setScholarships(data || []);
    }
  };

  const loadFavorites = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("favorites")
      .select("scholarship_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("FAVORITES ERROR:", error);
      return;
    }

    setFavorites(data.map((item) => item.scholarship_id));
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleFavorite = async (scholarshipId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const isFavorite = favorites.includes(scholarshipId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("scholarship_id", scholarshipId);

      if (!error) {
        setFavorites((prev) => prev.filter((id) => id !== scholarshipId));
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        scholarship_id: scholarshipId,
      });

      if (!error) {
        setFavorites((prev) => [...prev, scholarshipId]);
      }
    }
  };

  const filteredScholarships = scholarships.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.name?.toLowerCase().includes(keyword) ||
      item.provider?.toLowerCase().includes(keyword) ||
      item.country?.toLowerCase().includes(keyword);

    const matchCountry = !countryFilter || item.country === countryFilter;

    const matchLevel =
      !levelFilter ||
      item.level?.toLowerCase().includes(levelFilter.toLowerCase());

    const matchFunding = !fundingFilter || item.funding_type === fundingFilter;

    return matchSearch && matchCountry && matchLevel && matchFunding;
  });

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    switch (sortBy) {
      case "deadline_asc":
        return (
          new Date(a.deadline || "9999-12-31").getTime() -
          new Date(b.deadline || "9999-12-31").getTime()
        );

      case "deadline_desc":
        return (
          new Date(b.deadline || "1900-01-01").getTime() -
          new Date(a.deadline || "1900-01-01").getTime()
        );

      case "name_asc":
        return (a.name || "").localeCompare(b.name || "");

      case "name_desc":
        return (b.name || "").localeCompare(a.name || "");

      case "amount_desc":
        return Number(b.amount || 0) - Number(a.amount || 0);

      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScholarships = sortedScholarships.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const countries = [
    ...new Set(scholarships.map((s) => s.country).filter(Boolean)),
  ];

  const levels = [
    "Bachelor",
    "Master",
    "PhD",
    "Research Student",
    "Undergraduate",
  ];

  const fundings = [
    ...new Set(scholarships.map((s) => s.funding_type).filter(Boolean)),
  ];

  const getDeadlineBadge = (deadline: string) => {
    if (!deadline) {
      return {
        text: "No Deadline",
        color: "bg-gray-100 text-gray-700",
      };
    }

    const today = new Date();
    const end = new Date(deadline);

    const diffDays = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 30) {
      return {
        text: "Closing Soon",
        color: "bg-red-100 text-red-700",
      };
    }

    return {
      text: "Open",
      color: "bg-green-100 text-green-700",
    };
  };

  if (user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Scholarship Portal
              </h1>
              <h2 className="mt-3 text-xl font-semibold text-gray-800">
                Selamat datang, {user.user_metadata?.full_name || user.email}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/favorites"
                className="rounded-xl bg-pink-500 px-5 py-3 font-medium text-white shadow hover:bg-pink-600"
              >
                ❤️ My Favorites
              </Link>
              <button
                onClick={signOut}
                className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white shadow hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mb-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">
              Daftar Beasiswa
            </h2>

            <div className="mb-8 grid gap-4 md:grid-cols-5">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Total Beasiswa</p>
                <h3 className="mt-2 text-3xl font-bold text-blue-600">
                  {scholarships.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Negara</p>
                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {countries.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Fully Funded</p>
                <h3 className="mt-2 text-3xl font-bold text-purple-600">
                  {scholarships.filter((s) => s.funding_type === "Fully Funded").length}
                </h3>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Hasil Filter</p>
                <h3 className="mt-2 text-3xl font-bold text-orange-600">
                  {filteredScholarships.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Favorite Saya</p>
                <h3 className="mt-2 text-3xl font-bold text-pink-600">
                  {favorites.length}
                </h3>
              </div>
            </div>

            <input
              type="text"
              placeholder="Cari beasiswa, provider, atau negara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-5 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex flex-wrap gap-3">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="">Semua Negara</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="">Semua Level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={fundingFilter}
                onChange={(e) => setFundingFilter(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="">Semua Funding</option>
                {fundings.map((funding) => (
                  <option key={funding} value={funding}>
                    {funding}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="deadline_asc">Deadline Terdekat</option>
                <option value="deadline_desc">Deadline Terjauh</option>
                <option value="name_asc">Nama A–Z</option>
                <option value="name_desc">Nama Z–A</option>
                <option value="amount_desc">Nominal Terbesar</option>
              </select>
            </div>
          </div>

          {sortedScholarships.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <div>
                <div className="text-5xl">🔍</div>
                <h3 className="mt-4 text-2xl font-bold">Tidak ada hasil ditemukan</h3>
                <p className="mt-2 text-gray-500">Coba ubah kata kunci atau filter pencarian.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedScholarships.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white p-6 shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.name || item.title}
                      </h3>

                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => toggleFavorite(item.id)} className="text-2xl">
                          {favorites.includes(item.id) ? "❤️" : "🤍"}
                        </button>
                        {(() => {
                          const badge = getDeadlineBadge(item.deadline);
                          return (
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                              {badge.text}
                            </span>
                          );
                        })()}
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {item.funding_type || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Provider:</strong> {item.provider || "-"}</p>
                      <p><strong>Country:</strong> {item.country || "-"}</p>
                      <p><strong>Region:</strong> {item.region || "-"}</p>
                      <p><strong>Level:</strong> {item.level || "-"}</p>
                      <p><strong>Minimum GPA:</strong> {item.minimum_gpa || "-"}</p>
                      <p><strong>Deadline:</strong> {item.deadline || "-"}</p>
                      <p>
                        <strong>Amount:</strong>{" "}
                        {item.amount ? `Rp ${Number(item.amount).toLocaleString()}` : "-"}
                      </p>
                    </div>

                    <Link
                      href={`/scholarships/${item.id}`}
                      className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        currentPage === page ? "bg-blue-600 text-white shadow" : "border bg-white hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Scholarship Portal</h1>
      <p>Login untuk melanjutkan.</p>
      <button onClick={signInWithGoogle}>Login dengan Google</button>
    </main>
  );
}