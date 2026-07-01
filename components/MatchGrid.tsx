import type { APIMatch } from "@/types/match";
import MatchCard from "@/components/MatchCard";

export default function MatchGrid({ matches, emptyText = "No matches available." }: { matches: APIMatch[]; emptyText?: string }) {
  if (matches.length === 0) {
    return (
      <div className="glass rounded-[8px] p-8 text-center">
        <p className="text-sm font-bold text-white/60">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
