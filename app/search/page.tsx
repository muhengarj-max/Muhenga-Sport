import ErrorState from "@/components/ErrorState";
import { getAllMatches } from "@/lib/api";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  try {
    const matches = await getAllMatches();
    return <SearchClient matches={matches} />;
  } catch (error) {
    return (
      <div className="section-shell">
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      </div>
    );
  }
}
