"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    fullyFunded: 0,
    countries: 0,
    openScholarships: 0,
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === "admin") {
      setIsAdmin(true);
      fetchStats();
    } else {
      setIsAdmin(false);
    }
  };

  const fetchStats = async () => {
    const { data } = await supabase
      .from("scholarships")
      .select("*")
      .order("created_at", { ascending: false });

    setScholarships(data || []);

    const uniqueCountries = new Set(
      data?.map((s) => s.country)
    ).size;

    setStats({
      total: data?.length || 0,
      fullyFunded:
        data?.filter((s) => s.funding_type === "Fully Funded").length || 0,
      countries: uniqueCountries,
      openScholarships:
        data?.filter((s) => s.is_open === true).length || 0,
    });
  };

  const deleteScholarship = async (id: number) => {
    const confirmed = confirm("Yakin ingin menghapus beasiswa ini?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("scholarships")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus");
      return;
    }

    setScholarships((prev) => prev.filter((item) => item.id !== id));
    fetchStats();
  };

  if (isAdmin === null) return <main className="p-10">Loading...</main>;

  if (!isAdmin) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">403 - Access Denied</h1>
          <p className="mt-2 text-gray-600">Anda tidak memiliki hak akses sebagai admin.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* Dashboard Statistik */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Total Scholarship</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">{stats.total}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Fully Funded</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">{stats.fullyFunded}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Countries</p>
          <h2 className="mt-2 text-3xl font-bold text-indigo-600">{stats.countries}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Open Scholarships</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-600">{stats.openScholarships}</h2>
        </div>
      </div>

      {/* Manajemen Beasiswa */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold">Manajemen Beasiswa</h3>
        </div>

        <div className="mb-6 flex gap-3">
          <a
            href="/admin/new"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            + Tambah Beasiswa
          </a>

          <a
            href="/admin/logs"
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Sync Logs
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Negara</th>
                <th className="p-3 text-left">Funding</th>
                <th className="p-3 text-left">Deadline</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.country}</td>
                  <td className="p-3">{item.funding_type}</td>
                  <td className="p-3">{item.deadline}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/edit/${item.id}`}
                        className="rounded bg-yellow-500 px-3 py-2 text-white"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => deleteScholarship(item.id)}
                        className="rounded bg-red-500 px-3 py-2 text-white"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}