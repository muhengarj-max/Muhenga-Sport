import Link from "next/link";
import { Dumbbell } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import MatchGrid from "@/components/MatchGrid";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllMatches, getMatchesBySport, getSports } from "@/lib/api";

interface SportsPageProps {
  searchParams: Promise<{ sport?: string }>;
}

export const metadata = {
  title: "Sports",
};

export const dynamic = "force-dynamic";

export default async function SportsPage({ searchParams }: SportsPageProps) {
  const { sport } = await searchParams;

  try {
    const [sports, matches] = await Promise.all([getSports(), sport ? getMatchesBySport(sport) : getAllMatches()]);

    return (
      <PageShell>
        <div className="section-shell space-y-8">
          <section>
            <SectionHeader eyebrow="Sports" title="Categories" copy="Sports returned by /sports. Choose one to load /matches/{sport}." />
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Link className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black uppercase ${!sport ? "border-[#00C853] bg-[#00C853] text-black" : "border-white/10 bg-white/5 text-white/65"}`} href="/sports">
                All
              </Link>
              {sports.map((item) => {
                const name = typeof item === "string" ? item : item.name ?? item.id ?? item.slug ?? "Sport";
                const slug = typeof item === "string" ? item : item.slug ?? item.id ?? name;
                return (
                  <Link
                    key={slug}
                    href={`/sports?sport=${encodeURIComponent(slug)}`}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase ${
                      sport === slug ? "border-[#00C853] bg-[#00C853] text-black" : "border-white/10 bg-white/5 text-white/65"
                    }`}
                  >
                    <Dumbbell className="h-3.5 w-3.5" />
                    {name}
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <SectionHeader title={sport ? `${sport} Matches` : "All Sports Matches"} />
            <MatchGrid matches={matches} emptyText="No matches were returned for this category." />
          </section>
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
