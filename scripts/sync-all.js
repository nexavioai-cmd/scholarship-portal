const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// 1. Konfigurasi Environment Variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Variabel lingkungan tidak terbaca sempurna!");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// 2. Import Modul Scraper
const scrapeMext = require("./scrape-mext");
const scrapeLpdp = require("./scrape-lpdp");
const scrapeErasmus = require("./scrape-erasmus");

async function syncAll() {
  console.log("=== 🔄 START GLOBAL SYNCHRONIZATION WITH LOGS ===");
  const reports = [];
  
  try {
    // -------------------------------------------------------------
    // 1. EKSEKUSI PIPELINE SCRAPER SECARA ASYNC BERURUTAN
    // -------------------------------------------------------------
    // Menangkap return value objek log dari MEXT
    const mextResult = await scrapeMext();
    reports.push(mextResult);
    
    console.log("\n-----------------------------------------");
    
    // Menangkap return value objek log dari LPDP
    const lpdpResult = await scrapeLpdp();
    reports.push(lpdpResult);
    
    console.log("\n-----------------------------------------");
    
    // Menangkap return value objek log dari Erasmus Mundus
    const erasmusResult = await scrapeErasmus();
    reports.push(erasmusResult);
    
    // -------------------------------------------------------------
    // 2. BULK INSERT RIWAYAT LOG KE DATABASE
    // -------------------------------------------------------------
    console.log("\n💾 Menyimpan log performa sinkronisasi ke Supabase...");
    
    const { error: logError } = await supabaseAdmin
      .from("sync_logs")
      .insert(reports);

    if (logError) {
      console.error("❌ Gagal menyimpan riwayat sinkronisasi ke sync_logs:", logError.message);
    } else {
      console.log("✅ Berhasil memperbarui Dashboard Sync Logs!");
    }

    console.log("\n=========================================");
    console.log("🏁 SYNC COMPLETE - DATABASE REFRESHED!");
    console.log("=========================================");
  } catch (error) {
    console.error("❌ Global Sync Master Error:", error.message);
  }
}

// Menjalankan otomatisasi global
syncAll();