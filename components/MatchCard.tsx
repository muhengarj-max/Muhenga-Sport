import Link from "next/link";
import { CalendarClock, Play } from "lucide-react";
import type { APIMatch } from "@/types/match";
import { getBadgeUrl, isMatchLive, normalizeTimestamp } from "@/lib/api";
import Countdown from "@/components/Countdown";
import FavoriteButton from "@/components/FavoriteButton";
import LiveBadge from "@/components/LiveBadge";

export default function MatchCard({ match }: { match: APIMatch }) {
  const live = isMatchLive(match);
  const homeBadge = getBadgeUrl(match.teams?.home?.badge);
  const awayBadge = getBadgeUrl(match.teams?.away?.badge);

  return (
    <Link
      href={`/match/${encodeURIComponent(match.id)}`}
      className="glass group flex min-h-56 flex-col justify-between rounded-[8px] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#00C853]/45 hover:shadow-[0_24px_80px_rgba(0,200,83,0.10)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00C853]">{match.category}</p>
          <time className="mt-1 block text-xs text-white/45" dateTime={new Date(normalizeTimestamp(match.date)).toISOString()}>
            {new Intl.DateTimeFormat("en", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(normalizeTimestamp(match.date))}
          </time>
        </div>
        {live ? (
          <LiveBadge />
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-white/65">
            <CalendarClock className="h-3 w-3" />
            <Countdown date={match.date} />
          </span>
        )}
      </div>

      <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamLogo src={homeBadge} name={match.teams?.home?.name ?? "Home"} />
        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-black text-white/55">VS</div>
        <TeamLogo src={awayBadge} name={match.teams?.away?.name ?? "Away"} />
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 pt-4">
        <FavoriteButton matchId={match.id} compact />
        <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-white">{match.title}</span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#00C853] text-black transition group-hover:scale-105">
          <Play className="h-4 w-4 fill-current" />
        </span>
      </div>
    </Link>
  );
}

function TeamLogo({ src, name }: { src?: string; name: string }) {
  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] p-3">
        {src ? (
          <img src={src} alt={`${name} badge`} loading="lazy" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xl font-black text-white/35">{name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <p className="mt-2 truncate text-xs font-bold text-white/75">{name}</p>
    </div>
  );
}
