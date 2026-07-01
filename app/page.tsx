import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import Hero from "@/components/Hero";
import MatchGrid from "@/components/MatchGrid";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllMatches, getLiveMatches, getSports, getTodayMatches } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [all, live, today, sports] = await Promise.allSettled([getAllMatches(), getLiveMatches(), getTodayMatches(), getSports()]);
  const allMatches = all.status === "fulfilled" ? all.value : [];
  const liveMatches = live.status === "fulfilled" ? live.value : [];
  const todayMatches = today.status === "fulfilled" ? today.value : [];
  const sportsList = sports.status === "fulfilled" ? sports.value : [];
  const featured = liveMatches.find((match) => match.popular) ?? allMatches.find((match) => match.popular) ?? liveMatches[0] ?? todayMatches[0] ?? allMatches[0];

  return (
    <PageShell>
      <div className="section-shell space-y-10">
        <Hero match={featured} />

        <section>
          <SectionHeader eyebrow="Now streaming" title="Live Matches" copy="Active broadcasts from the live endpoint, ready for instant HLS playback." />
          <MatchGrid matches={liveMatches.slice(0, 6)} emptyText="There are no live matches from the API right now." />
          <Link href="/live" className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#00C853]">
            View all live <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <SectionHeader eyebrow="Schedule" title="Today" copy="All matches returned by /matches/all-today." />
          <MatchGrid matches={todayMatches.slice(0, 6)} emptyText="The API returned no matches for today." />
        </section>

        <section>
          <SectionHeader eyebrow="Browse" title="Sports Categories" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sportsList.slice(0, 8).map((sport) => {
              const name = typeof sport === "string" ? sport : sport.name ?? sport.id ?? sport.slug ?? "Sport";
              const slug = typeof sport === "string" ? sport : sport.slug ?? sport.id ?? name;
              return (
                <Link key={slug} href={`/sports?sport=${encodeURIComponent(slug)}`} className="glass flex items-center gap-3 rounded-[8px] p-4 transition hover:border-[#00C853]/40">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#00C853]/15 text-[#00C853]">
                    <Dumbbell className="h-5 w-5" />
                  </span>
                  <span className="font-black uppercase tracking-wide">{name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
