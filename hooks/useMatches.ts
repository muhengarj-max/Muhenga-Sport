"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { APIMatch, Sport } from "@/types/match";
import { getAllMatches, getLiveMatches, getSports, getTodayMatches, isMatchLive } from "@/lib/api";

interface MatchState {
  all: APIMatch[];
  live: APIMatch[];
  today: APIMatch[];
  sports: Sport[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMatches(): MatchState {
  const [all, setAll] = useState<APIMatch[]>([]);
  const [live, setLive] = useState<APIMatch[]>([]);
  const [today, setToday] = useState<APIMatch[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [allMatches, liveMatches, todayMatches, sportList] = await Promise.all([
        getAllMatches(),
        getLiveMatches(),
        getTodayMatches(),
        getSports(),
      ]);

      setAll(Array.isArray(allMatches) ? allMatches : []);
      setLive(Array.isArray(liveMatches) ? liveMatches : []);
      setToday(Array.isArray(todayMatches) ? todayMatches : []);
      setSports(Array.isArray(sportList) ? sportList : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the Muhenga Sport API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const derivedLive = useMemo(() => {
    if (live.length > 0) return live;
    return all.filter(isMatchLive);
  }, [all, live]);

  return { all, live: derivedLive, today, sports, loading, error, refresh };
}
