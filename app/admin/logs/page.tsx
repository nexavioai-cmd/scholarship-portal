"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Log {
  id: number;
  source: string;
  provider: string; // Menggunakan provider sesuai contoh kedua
  inserted_count: number;
  status: string;
  created_at: string;
}

export default function SyncLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("sync_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching logs:", error);
    } else {
      setLogs(data || []);
    }
    setIsLoading(false);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Automation Sync Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau status kesehatan dan performa sinkronisasi harian</p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? "Memuat..." : "🔄 Refresh Status"}
        </button>
      </div>

      {/* CONTENT */}
      {isLoading && logs.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-500 shadow-sm">
          Belum ada riwayat sinkronisasi otomatis yang tercatat.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Inserted</th>
                  <th className="px-6 py-4">Waktu (WIB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{log.source || log.provider}</td>
                    <td className="px-6 py-4">
                      {log.status === "success" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">🟢 Success</span>
                      ) : log.status === "fallback" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">🟡 Fallback</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">🔴 Error</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">{log.inserted_count}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta"
                      })} WIB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}