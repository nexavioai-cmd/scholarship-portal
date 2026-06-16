'use client' // Wajib ada di baris paling atas

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Pastikan path ini sesuai dengan struktur folder Anda
import { useRouter } from 'next/navigation';

export default function NewScholarshipPage() {
  const router = useRouter();
  
  // Contoh state untuk form (silakan sesuaikan dengan field yang Anda punya)
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [country, setCountry] = useState('');
  const [level, setLevel] = useState('');
  const [funding_type, setFundingType] = useState('');
  const [deadline, setDeadline] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman reload saat tombol ditekan

    try {
      const { error } = await supabase.from("scholarships").insert({
        name,
        provider,
        country,
        level,
        funding_type,
        deadline,
        amount: amount ? Number(amount) : null,
      });

      if (error) throw error;

      // Jika berhasil, arahkan ke halaman admin
      router.push("/admin");
    } catch (error) {
      console.error("Gagal menambahkan beasiswa:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tambah Beasiswa Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input placeholder="Nama Beasiswa" onChange={(e) => setName(e.target.value)} className="border p-2" />
        <input placeholder="Penyedia" onChange={(e) => setProvider(e.target.value)} className="border p-2" />
        {/* Tambahkan input lain sesuai kebutuhan */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Simpan Beasiswa
        </button>
      </form>
    </main>
  );
}