import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import type { APIMatch } from "@/types/match";
import { getBadgeUrl, getPosterUrl, isMatchLive } from "@/lib/api";
import FavoriteButton from "@/components/FavoriteButton";
import LiveBadge from "@/components/LiveBadge";

export default function Hero({ match }: { match?: APIMatch }) {
  if (!match) {
    return (
      <section className="glass flex min-h-[420px] items-center justify-center rounded-[8px] p-8 text-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#00C853]">Muhenga Sport</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">No matches available</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">The API returned an empty schedule. Check back shortly for updated broadcasts.</p>
        </div>
      </section>
    );
  }

  const poster = getPosterUrl(match);
  const homeBadge = getBadgeUrl(match.teams?.home?.badge);
  const awayBadge = getBadgeUrl(match.teams?.away?.badge);

  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-[8px] border border-white/10 bg-black">
      {poster ? (
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[1px]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,200,83,0.28),transparent_35%),linear-gradient(135deg,#101410,#020302)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-5 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {isMatchLive(match) ? <LiveBadge label="Featured live" /> : <span className="rounded-full border border-[#00C853]/30 bg-[#00C853]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#00C853]">Featured</span>}
            {match.popular && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/80">
                <Sparkles className="h-3 w-3 text-[#00C853]" />
                Popular
              </span>
            )}
          </div>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">Muhenga Sport</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-white sm:text-xl">{match.title}</p>
          <div className="mt-5 flex items-center gap-3">
            <HeroBadge src={homeBadge} name={match.teams?.home?.name} />
            <span className="text-xs font-black uppercase tracking-[0.22em] text-white/35">vs</span>
            <HeroBadge src={awayBadge} name={match.teams?.away?.name} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/match/${encodeURIComponent(match.id)}`}
              className="inline-flex h-12 items-center gap-2 rounded-[8px] bg-[#00C853] px-5 text-sm font-black uppercase tracking-wide text-black shadow-[0_0_35px_rgba(0,200,83,0.3)]"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Match
            </Link>
            <FavoriteButton matchId={match.id} />
            <Link href="/live" className="inline-flex h-12 items-center gap-2 rounded-[8px] border border-white/10 bg-white/10 px-5 text-sm font-black uppercase tracking-wide text-white hover:bg-white/15">
              Live Hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ src, name }: { src?: string; name?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[8px] border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-xl">
      <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white/10 p-1.5">
        {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : <span className="text-xs font-black">{name?.slice(0, 2)}</span>}
      </div>
      <span className="max-w-32 truncate text-xs font-bold text-white/80">{name ?? "Team"}</span>
    </div>
  );
}
