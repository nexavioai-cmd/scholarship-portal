"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditScholarshipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Mengambil ID dari URL dynamic route [id]

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // State untuk form fields
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    country: "",
    funding_type: "Fully Funded",
    deadline: "",
  });

  // Load data lama berdasarkan ID saat halaman dibuka
  useEffect(() => {
    if (!id) return;

    const fetchScholarship = async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("ERROR FETCH:", error);
        alert("Gagal mengambil data beasiswa");
        router.push("/admin");
      } else if (data) {
        setFormData({
          name: data.name || "",
          provider: data.provider || "",
          country: data.country || "",
          funding_type: data.funding_type || "Fully Funded",
          deadline: data.deadline || "",
        });
      }
      setFetching(false);
    };

    fetchScholarship();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Update data berdasarkan ID beasiswa
    const { error } = await supabase
      .from("scholarships")
      .update(formData)
      .eq("id", id);

    setLoading(false);

    if (error) {
      console.error("ERROR UPDATE:", error);
      alert("Gagal memperbarui data: " + error.message);
    } else {
      alert("Beasiswa berhasil diperbarui!");
      router.push("/admin"); // Kembali ke dashboard admin
      router.refresh();
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Memuat data beasiswa...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Data Beasiswa</h1>
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            ← Kembali ke Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Beasiswa</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Provider / Penyelenggara</label>
            <input
              type="text"
              name="provider"
              required
              value={formData.provider}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Negara</label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipe Pendanaan</label>
            <select
              name="funding_type"
              value={formData.funding_type}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="Fully Funded">Fully Funded</option>
              <option value="Partial Funded">Partial Funded</option>
              <option value="Self Funded">Self Funded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-yellow-500 py-3 font-semibold text-white shadow hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? "Memperbarui..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </main>
  );
}