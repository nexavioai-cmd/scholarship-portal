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

async function scrapeMext() {
  console.log("🚀 Memulai proses otomatisasi Beasiswa MEXT...");
  let insertedCount = 0;
  let currentStatus = "success";

  try {
    // -------------------------------------------------------------
    // 1. CLEANING ANTRIAN PENDING LAMA
    // -------------------------------------------------------------
    console.log("🧹 Membersihkan antrean data MEXT pending lama...");
    const { error: deleteError } = await supabaseAdmin
      .from("scholarships")
      .delete()
      .eq("provider", "MEXT (Pemerintah Jepang)")
      .eq("approval_status", "pending");

    if (deleteError) {
      console.error("⚠️ Gagal membersihkan data lama:", deleteError.message);
    } else {
      console.log("✅ Database bersih! Siap menerima data segar.");
    }

    // -------------------------------------------------------------
    // 2. PROSES SCRAPING HTML
    // -------------------------------------------------------------
    const targetUrl = "https://www.id.emb-japan.go.jp/sch.html"; 
    let scrapedScholarships = [];

    try {
      const { data } = await axios.get(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        timeout: 8000
      });
      const $ = cheerio.load(data);

      $("li a").each((index, element) => {
        const text = $(element).text().trim();
        if (text.toLowerCase().includes("program") && (text.toLowerCase().includes("research") || text.toLowerCase().includes("undergraduate"))) {
          scrapedScholarships.push({
            name: `Beasiswa MEXT: ${text}`,
            provider: "MEXT (Pemerintah Jepang)",
            country: "Jepang",
            funding_type: "Fully Funded",
            deadline: "2026-09-15",
            scrape_source: "live" // Ditandai live secara profesional
          });
        }
      });
    } catch (e) {
      // Mengabaikan error koneksi agar dialihkan ke fallback block di bawah
    }

    // Jalur Penyelamat jika scraping gagal/timeout
    if (scrapedScholarships.length === 0) {
      console.log("⚠️ Selector HTML meleset/timeout. Mengaktifkan Fallback Data Baku...");
      currentStatus = "fallback";
      scrapedScholarships.push({
        name: "Beasiswa MEXT Monbukagakusho 2026 (Research Students)", // Nama bersih tanpa tag teks kotor
        provider: "MEXT (Pemerintah Jepang)",
        country: "Jepang",
        funding_type: "Fully Funded",
        deadline: "2026-09-15",
        scrape_source: "fallback" // Ditandai fallback melalui kolom khusus
      });
    }

    console.log(`📦 Berhasil mengumpulkan ${scrapedScholarships.length} data riil MEXT.`);

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

    console.log(`\n🏁 [SELESAI] MEXT Selesai! Total Insert Baru: ${insertedCount}`);
    
    // Mengembalikan data log objek untuk dibaca oleh sync-all.js
    return { provider: "MEXT (Pemerintah Jepang)", inserted_count: insertedCount, status: currentStatus };
  } catch (error) {
    console.error("❌ Terjadi kesalahan sistem saat scraping MEXT:", error.message);
    return { provider: "MEXT (Pemerintah Jepang)", inserted_count: 0, status: "error" };
  }
}

module.exports = scrapeMext;

if (require.main === module) {
  scrapeMext();
}