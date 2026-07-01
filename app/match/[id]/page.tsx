import Link from "next/link";
import { ArrowLeft, CalendarClock, Radio } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import FavoriteButton from "@/components/FavoriteButton";
import LiveBadge from "@/components/LiveBadge";
import PageShell from "@/components/PageShell";
import StreamPlayer from "@/components/StreamPlayer";
import { getAllMatches, getBadgeUrl, isMatchLive, normalizeTimestamp } from "@/lib/api";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MatchPageProps) {
  const { id } = await params;
  return { title: `Match ${decodeURIComponent(id)}` };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  try {
    const matches = await getAllMatches();
    const match = matches.find((item) => item.id === decodedId);

    if (!match) {
      return (
        <div className="section-shell">
          <ErrorState title="Match not found" message="The selected match was not returned by /matches/all." />
        </div>
      );
    }

    const homeBadge = getBadgeUrl(match.teams?.home?.badge);
    const awayBadge = getBadgeUrl(match.teams?.away?.badge);

    return (
      <PageShell>
        <div className="section-shell space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wide text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <StreamPlayer match={match} />
              <div className="glass rounded-[8px] p-5">
                <div className="flex flex-wrap items-center gap-3">
                  {isMatchLive(match) ? <LiveBadge /> : <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/65">Scheduled</span>}
                  <span className="rounded-full border border-[#00C853]/20 bg-[#00C853]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#00C853]">{match.category}</span>
                </div>
                <h1 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-5xl">{match.title}</h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/55">
                  <CalendarClock className="h-4 w-4 text-[#00C853]" />
                  {new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(normalizeTimestamp(match.date))}
                </p>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="glass rounded-[8px] p-5">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-[#00C853]">Teams</p>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <Team src={homeBadge} name={match.teams?.home?.name ?? "Home"} />
                  <span className="text-xs font-black text-white/35">VS</span>
                  <Team src={awayBadge} name={match.teams?.away?.name ?? "Away"} />
                </div>
                <div className="mt-5">
                  <FavoriteButton matchId={match.id} />
                </div>
              </div>

              <div className="glass rounded-[8px] p-5">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-[#00C853]">Available Sources</p>
                <div className="space-y-2">
                  {match.sources.length > 0 ? (
                    match.sources.map((source) => (
                      <div key={`${source.source}-${source.id}`} className="flex items-center justify-between rounded-[8px] border border-white/10 bg-white/5 px-3 py-3">
                        <span className="text-sm font-bold">{source.source}</span>
                        <Radio className="h-4 w-4 text-[#00C853]" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/55">No stream sources were returned for this match.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </PageShell>
    );
  } catch (error) {
    return (
      <div className="section-shell">
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      </div>
    );
  }
}

function Team({ src, name }: { src?: string; name: string }) {
  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.06] p-4">
        {src ? <img src={src} alt={`${name} badge`} className="h-full w-full object-contain" /> : <span className="text-xl font-black text-white/40">{name.slice(0, 2)}</span>}
      </div>
      <p className="mt-2 truncate text-xs font-black uppercase text-white/75">{name}</p>
    </div>
  );
}
