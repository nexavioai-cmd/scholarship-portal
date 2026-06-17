"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke monitoring service (seperti Sentry) jika ada
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Oops! Terjadi Kesalahan</h2>
      <p className="mt-4 text-gray-600 max-w-md">
        Sepertinya ada masalah saat memuat halaman beasiswa ini. Silakan coba lagi atau kembali ke beranda.
      </p>
      
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Coba Lagi
        </button>
        <Link 
          href="/" 
          className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}