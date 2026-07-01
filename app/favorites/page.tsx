import ErrorState from "@/components/ErrorState";
import { getAllMatches } from "@/lib/api";
import FavoritesClient from "./FavoritesClient";

export const metadata = {
  title: "Favorites",
};

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  try {
    const matches = await getAllMatches();
    return <FavoritesClient matches={matches} />;
  } catch (error) {
    return (
      <div className="section-shell">
        <ErrorState message={error instanceof Error ? error.message : undefined} />
      </div>
    );
  }
}
