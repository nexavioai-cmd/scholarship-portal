"use client";
import { Heart } from "lucide-react";

export default function FavoriteButton({ isFavorite, onClick, saving }: { isFavorite: boolean, onClick: () => void, saving: boolean }) {
  return (
    <button 
      onClick={onClick} 
      disabled={saving}
      className={`px-6 py-3 rounded-xl border font-semibold flex items-center gap-2 transition ${isFavorite ? "bg-pink-50 text-pink-600 border-pink-200" : "hover:bg-gray-50"}`}
    >
      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} /> 
      {saving ? "..." : isFavorite ? "Saved" : "Save"}
    </button>
  );
}