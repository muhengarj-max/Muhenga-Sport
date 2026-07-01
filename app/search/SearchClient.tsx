"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import MatchGrid from "@/components/MatchGrid";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import type { APIMatch } from "@/types/match";

export default function SearchClient({ matches }: { matches: APIMatch[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return matches;
    return matches.filter((match) => {
      const haystack = [
        match.title,
        match.category,
        match.teams?.home?.name,
        match.teams?.away?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [matches, query]);

  return (
    <PageShell>
      <div className="section-shell space-y-6">
        <SectionHeader eyebrow="Search" title="Find a Broadcast" copy="Search match titles, categories, and team names returned by the API." />
        <div className="glass flex items-center gap-3 rounded-[8px] p-4">
          <Search className="h-5 w-5 text-[#00C853]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, team, or sport"
            className="w-full bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/35"
          />
        </div>
        <MatchGrid matches={results} emptyText="No broadcasts matched your search." />
      </div>
    </PageShell>
  );
}
