import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Konfigurasi wajib untuk serverless environment Vercel
export const maxDuration = 60; // Mengizinkan fungsi berjalan hingga 60 detik (Maksimum Hobby Plan)
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Proteksi Keamanan Ekstra: Validasi Token Rahasia Vercel Cron
  // Masukkan variabel CRON_SECRET di dashboard Vercel (bisa diisi string acak bebas)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  console.log("=== 🔄 VERCEL CRON: START GLOBAL SYNCHRONIZATION ===");
  const reports: any[] = [];

  // Inisialisasi Supabase Admin menggunakan Service Role Key agar kebal RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // 2. Memuat Fungsi Scraper secara Dinamis (Aman untuk Bundling Serverless Vercel)
    const scrapeMext = require("../../../../scripts/scrape-mext");
    const scrapeLpdp = require("../../../../scripts/scrape-lpdp");
    const scrapeErasmus = require("../../../../scripts/scrape-erasmus");

    console.log("⏳ Memproses Beasiswa MEXT...");
    const mextResult = await scrapeMext();
    reports.push(mextResult);

    console.log("⏳ Memproses Beasiswa LPDP...");
    const lpdpResult = await scrapeLpdp();
    reports.push(lpdpResult);

    console.log("⏳ Memproses Beasiswa Erasmus...");
    const erasmusResult = await scrapeErasmus();
    reports.push(erasmusResult);

    // 3. Masukkan Ringkasan Log Performa ke Tabel sync_logs
    console.log("💾 Menyimpan ringkasan statistik ke Supabase...");
    const { error: logError } = await supabaseAdmin
      .from("sync_logs")
      .insert(reports);

    if (logError) {
      console.error("❌ Gagal mencatat statistik ke sync_logs:", logError.message);
      return NextResponse.json({ success: false, error: logError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Serverless synchronization complete and logged successfully!",
      summary: reports
    });

  } catch (error: any) {
    console.error("❌ Critical Serverless Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}