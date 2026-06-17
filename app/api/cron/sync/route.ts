import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Konfigurasi durasi agar sinkronisasi tidak terputus di tengah jalan
export const maxDuration = 60; 
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Keamanan: Validasi Token Rahasia
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("=== 🔄 STARTING AUTOMATED SYNCHRONIZATION ===");

  // Inisialisasi Supabase Admin (Menggunakan Service Role Key agar tidak terblokir RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // 2. Impor Skrip (Pastikan path ke file skrip Anda benar)
    const scrapeMext = require("../../../../scripts/scrape-mext");
    const scrapeLpdp = require("../../../../scripts/scrape-lpdp");
    const scrapeErasmus = require("../../../../scripts/scrape-erasmus");

    console.log("⏳ Memulai proses scraping...");
    
    // Menjalankan semua skrip secara berurutan
    const reports = [
      await scrapeMext(),
      await scrapeLpdp(),
      await scrapeErasmus()
    ];

    // 3. Simpan statistik ke tabel sync_logs
    console.log("💾 Menyimpan ringkasan ke database...");
    const { error: logError } = await supabaseAdmin
      .from("sync_logs")
      .insert(reports);

    if (logError) {
      throw new Error(`Gagal menyimpan log: ${logError.message}`);
    }

    console.log("✅ Sinkronisasi selesai!");
    return NextResponse.json({ 
      success: true, 
      message: "Sync process completed",
      summary: reports 
    });

  } catch (error: any) {
    console.error("❌ Sync Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}