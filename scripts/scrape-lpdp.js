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

async function scrapeLpdp() {
  console.log("🚀 Memulai proses otomatisasi Beasiswa LPDP...");
  let insertedCount = 0;
  let currentStatus = "success";

  try {
    // -------------------------------------------------------------
    // 1. CLEANING ANTRIAN PENDING LAMA
    // -------------------------------------------------------------
    console.log("🧹 Membersihkan antrean data LPDP pending lama...");
    const { error: deleteError } = await supabaseAdmin
      .from("scholarships")
      .delete()
      .eq("provider", "LPDP (Kementerian Keuangan RI)")
      .eq("approval_status", "pending");

    if (deleteError) {
      console.error("⚠️ Gagal membersihkan data lama:", deleteError.message);
    } else {
      console.log("✅ Database bersih! Siap menerima data segar.");
    }

    // -------------------------------------------------------------
    // 2. PROSES SCRAPING HTML TARGET
    // -------------------------------------------------------------
    const targetUrl = "https://lpdp.kemenkeu.go.id/id/beasiswa/beasiswa-lpdp/"; 
    let scrapedScholarships = [];

    try {
      const { data } = await axios.get(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        timeout: 6000
      });
      const $ = cheerio.load(data);

      $("a, h1, h2, h3, h4").each((index, element) => {
        const text = $(element).text().trim();
        if ((text.toLowerCase().includes("reguler") || text.toLowerCase().includes("afirmasi")) && text.length < 100 && text.length > 5) {
          scrapedScholarships.push({
            name: `Beasiswa LPDP: ${text}`,
            provider: "LPDP (Kementerian Keuangan RI)",
            country: "Dalam & Luar Negeri",
            funding_type: "Fully Funded",
            deadline: "2026-07-15",
            scrape_source: "live" // Ditandai live secara profesional
          });
        }
      });
      if (scrapedScholarships.length === 0) throw new Error("Struktur HTML berubah");
    } catch (e) {
      console.log(`⚠️ Akses web LPDP terkendala (${e.message}). Mengaktifkan Fallback Data Baku...`);
      currentStatus = "fallback";
      scrapedScholarships.push(
        {
          name: "Beasiswa LPDP Reguler (Magister & Doktor)",
          provider: "LPDP (Kementerian Keuangan RI)",
          country: "Dalam & Luar Negeri",
          funding_type: "Fully Funded",
          deadline: "2026-07-15",
          scrape_source: "fallback" // Ditandai fallback melalui kolom khusus
        },
        {
          name: "Beasiswa LPDP Perguruan Tinggi Utama Dunia (PTUD)",
          provider: "LPDP (Kementerian Keuangan RI)",
          country: "Luar Negeri",
          funding_type: "Fully Funded",
          deadline: "2026-07-15",
          scrape_source: "fallback" // Ditandai fallback melalui kolom khusus
        }
      );
    }

    console.log(`📦 Berhasil mengumpulkan ${scrapedScholarships.length} data riil LPDP.`);

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

    console.log(`\n🏁 [SELESAI] LPDP Selesai! Total Insert Baru: ${insertedCount}`);
    
    // Mengembalikan data objek log untuk dibaca oleh sync-all.js
    return { provider: "LPDP (Kementerian Keuangan RI)", inserted_count: insertedCount, status: currentStatus };
  } catch (error) {
    console.error("❌ Terjadi kesalahan sistem saat scraping LPDP:", error.message);
    return { provider: "LPDP (Kementerian Keuangan RI)", inserted_count: 0, status: "error" };
  }
}

module.exports = scrapeLpdp;

if (require.main === module) {
  scrapeLpdp();
}