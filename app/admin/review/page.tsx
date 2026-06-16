"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ReviewPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data hanya dengan status 'pending'
  useEffect(() => {
    loadPendingScholarships();
  }, []);

  const loadPendingScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal memuat antrean review:", error);
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  };

  // Tahap 3 — Fungsi Approve
  const approveScholarship = async (id: number) => {
    const { error } = await supabase
      .from("scholarships")
      .update({ approval_status: "approved" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal melakukan approval.");
      return;
    }

    // Hapus dari antrean layar saat ini
    setScholarships((prev) => prev.filter((item) => item.id !== id));
  };

  // Tahap 4 — Fungsi Reject
  const rejectScholarship = async (id: number) => {
    const confirmed = confirm("Yakin ingin menolak (reject) beasiswa ini?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("scholarships")
      .update({ approval_status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal menolak data.");
      return;
    }

    // Hapus dari antrean layar saat ini
    setScholarships((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Modul */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Persetujuan Beasiswa</h1>
            <p className="text-sm text-gray-500 mt-1">
              Menampilkan hasil scraper yang membutuhkan moderasi admin sebelum dipublikasikan.
            </p>
          </div>
          <Link href="/admin" className="text-sm font-medium text-blue-600 hover:underline">
            ← Kembali ke Dashboard Utama
          </Link>
        </div>

        {/* Layout Antrean Tabel */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow text-gray-500">
            Memuat data antrean...
          </div>
        ) : scholarships.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <span className="text-4xl">🎉</span>
            <h3 className="mt-2 font-semibold text-gray-800">Antrean Bersih!</h3>
            <p className="text-sm text-gray-500">Semua data hasil scraper telah ditinjau.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nama Beasiswa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Negara</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Deadline</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Aksi Moderasi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {scholarships.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.provider}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.country}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.deadline || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* Button Approve */}
                        <button
                          onClick={() => approveScholarship(item.id)}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        
                        {/* Button Reject */}
                        <button
                          onClick={() => rejectScholarship(item.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                        >
                          Reject
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