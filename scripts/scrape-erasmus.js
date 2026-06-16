const axios = require("axios");
const cheerio = require("cheerio");
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

async function scrapeErasmus() {
  console.log("🚀 Memulai proses otomatisasi Beasiswa Erasmus Mundus...");
  let insertedCount = 0;
  let currentStatus = "success";

  try {
    // -------------------------------------------------------------
    // 1. CLEANING ANTRIAN PENDING LAMA
    // -------------------------------------------------------------
    console.log("🧹 Membersihkan antrean data Erasmus pending lama...");
    const { error: deleteError } = await supabaseAdmin
      .from("scholarships")
      .delete()
      .eq("provider", "EACEA (Uni Eropa)")
      .eq("approval_status", "pending");

    if (deleteError) {
      console.error("⚠️ Gagal membersihkan data lama:", deleteError.message);
    } else {
      console.log("✅ Database bersih! Siap menerima data segar.");
    }

    // -------------------------------------------------------------
    // 2. PROSES SCRAPING HTML TARGET
    // -------------------------------------------------------------
    const targetUrl = "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters"; 
    let scrapedScholarships = [];

    try {
      const { data } = await axios.get(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        timeout: 8000
      });
      const $ = cheerio.load(data);

      $("h1, h2, h3, a").each((index, element) => {
        const text = $(element).text().trim();
        const lowerText = text.toLowerCase();
        
        if (
          lowerText.includes("erasmus mundus") && 
          !lowerText.includes("top reasons") && 
          !lowerText.includes("stories") && 
          !lowerText.includes("how to apply") &&
          text.length < 100 && text.length > 10
        ) {
          scrapedScholarships.push({
            name: text,
            provider: "EACEA (Uni Eropa)",
            country: "Eropa (Multi-negara)",
            funding_type: "Fully Funded",
            deadline: "2026-02-15",
            scrape_source: "live" // Ditandai live secara profesional
          });
        }
      });

      if (scrapedScholarships.length === 0) throw new Error("HTML Berubah");
    } catch (e) {
      console.log(`⚠️ Akses web Erasmus terkendala (${e.message}). Mengaktifkan Fallback Data Baku...`);
      currentStatus = "fallback";
      scrapedScholarships.push({
        name: "Erasmus Mundus Joint Masters (EMJM) Scholarship 2026", // Nama bersih tanpa tag teks kotor
        provider: "EACEA (Uni Eropa)",
        country: "Eropa (Multi-negara)",
        funding_type: "Fully Funded",
        deadline: "2026-02-15",
        scrape_source: "fallback" // Ditandai fallback melalui kolom khusus
      });
    }

    console.log(`📦 Berhasil mengumpulkan ${scrapedScholarships.length} data riil Erasmus.`);

    // -------------------------------------------------------------
    // 3. PROSES INSERT DAN VERIFIKASI DUPLIKASI
    // -------------------------------------------------------------
    for (const scholarship of scrapedScholarships) {
      const { data: existing } = await supabaseAdmin
        .from("scholarships")
        .select("id")
        .eq("name", scholarship.name)
        .eq("provider", scholarship.provider)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabaseAdmin
          .from("scholarships")
          .insert({ ...scholarship, approval_status: "pending" });

        if (insertError) {
          console.error(`❌ Gagal menyimpan [${scholarship.name}]:`, insertError.message);
        } else {
          console.log(`✅ BERHASIL INSERT DATA FRESH: ${scholarship.name}`);
          insertedCount++;
        }
      } else {
        console.log(`skip ⏭️ DATA SUDAH ADA DI DATABASE: ${scholarship.name}`);
      }
    }

    console.log(`\n🏁 [SELESAI] Erasmus Selesai! Total Insert Baru: ${insertedCount}`);
    
    // Mengembalikan data log objek untuk dibaca oleh sync-all.js
    return { provider: "EACEA (Uni Eropa)", inserted_count: insertedCount, status: currentStatus };
  } catch (error) {
    console.error("❌ Terjadi kesalahan sistem saat scraping Erasmus:", error.message);
    return { provider: "EACEA (Uni Eropa)", inserted_count: 0, status: "error" };
  }
}

module.exports = scrapeErasmus;

if (require.main === module) {
  scrapeErasmus();
}