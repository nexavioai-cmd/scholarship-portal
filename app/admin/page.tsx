"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  // 2. State data admin
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Load data saat halaman dibuka
  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Gagal memuat data beasiswa.");
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  };

  // 4. Fungsi Delete
  const deleteScholarship = async (id: number) => {
    const confirmed = confirm("Yakin ingin menghapus beasiswa ini?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("scholarships")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal menghapus.");
      return;
    }

    // Filter out dari state agar UI langsung ter-update
    setScholarships((prev) => prev.filter((item) => item.id !== id));

    alert("Beasiswa berhasil dihapus.");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        
        {/* 1. Tampilkan tombol Tambah/Edit/Hapus dengan UI rapi */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Sistem Manajemen Konten Data Beasiswa</p>
          </div>

          <Link
            href="/admin/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 shadow transition"
          >
            + Tambah Beasiswa
          </Link>
        </div>

        {/* 5. Tampilkan tabel admin */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow text-gray-500">
            Memuat tabel data beasiswa...
          </div>
        ) : scholarships.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-gray-500 font-medium">Belum ada data beasiswa di database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nama Beasiswa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Negara</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Deadline</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {scholarships.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.provider}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.country}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.deadline || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin/edit/${item.id}`}
                          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteScholarship(item.id)}
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
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
        )}
      </div>
    </main>
  );
}