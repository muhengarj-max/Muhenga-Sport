"use client";

import { useEffect, useMemo, useState } from "react";
import MatchGrid from "@/components/MatchGrid";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import { getStoredFavorites } from "@/components/FavoriteButton";
import type { APIMatch } from "@/types/match";

export default function FavoritesClient({ matches }: { matches: APIMatch[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavoriteIds(getStoredFavorites());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("muhenga-favorites-change", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("muhenga-favorites-change", sync as EventListener);
    };
  }, []);

  const favorites = useMemo(() => matches.filter((match) => favoriteIds.includes(match.id)), [favoriteIds, matches]);

  return (
    <PageShell>
      <div className="section-shell">
        <SectionHeader eyebrow="Saved locally" title="Favorites" copy="Favorite matches are stored in your browser so your quick-access list stays private." />
        <MatchGrid matches={favorites} emptyText="You have not saved any matches yet." />
      </div>
    </PageShell>
  );
}
