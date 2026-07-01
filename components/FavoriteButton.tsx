"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "muhenga-sport:favorites";

export function getStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setStoredFavorites(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("muhenga-favorites-change", { detail: ids }));
}

export default function FavoriteButton({ matchId, compact = false }: { matchId: string; compact?: boolean }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const sync = () => setFavorite(getStoredFavorites().includes(matchId));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("muhenga-favorites-change", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("muhenga-favorites-change", sync as EventListener);
    };
  }, [matchId]);

  return (
    <button
      type="button"
      aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
      title={favorite ? "Remove from favorites" : "Save to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const current = getStoredFavorites();
        const next = current.includes(matchId) ? current.filter((id) => id !== matchId) : [...current, matchId];
        setStoredFavorites(next);
        setFavorite(next.includes(matchId));
      }}
      className={`inline-flex items-center justify-center rounded-[8px] border transition ${
        compact ? "h-10 w-10" : "h-11 gap-2 px-4"
      } ${
        favorite
          ? "border-[#00C853]/50 bg-[#00C853]/15 text-[#00C853]"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
      }`}
    >
      <Star className={`h-4 w-4 ${favorite ? "fill-[#00C853]" : ""}`} />
      {!compact && <span className="text-xs font-black uppercase tracking-wider">{favorite ? "Saved" : "Favorite"}</span>}
    </button>
  );
}
