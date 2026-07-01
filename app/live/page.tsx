import ErrorState from "@/components/ErrorState";
import MatchGrid from "@/components/MatchGrid";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import { getLiveMatches } from "@/lib/api";

export const metadata = {
  title: "Live Matches",
};

export const dynamic = "force-dynamic";

export default async function LivePage() {
  try {
    const matches = await getLiveMatches();
    return (
      <PageShell>
        <div className="section-shell">
          <SectionHeader eyebrow="Live hub" title="Active Broadcasts" copy="Every match currently returned by /matches/live." />
          <MatchGrid matches={matches} emptyText="No live broadcasts are available right now." />
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
