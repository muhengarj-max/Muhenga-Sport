"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStream } from "@/lib/api";
import type { APIMatch, ResolvedStream } from "@/types/match";

export function useStream(match?: APIMatch | null) {
  const sources = useMemo(() => match?.sources ?? [], [match]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [stream, setStream] = useState<ResolvedStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSource = useCallback(
    async (index: number) => {
      const source = sources[index];
      if (!source) {
        setStream(null);
        setError("No stream sources are available for this match.");
        return;
      }

      setCurrentSourceIndex(index);
      setLoading(true);
      setError(null);

      try {
        const resolved = await getStream(source.source, source.id);
        setStream(resolved);
      } catch (err) {
        const nextIndex = index + 1;
        if (nextIndex < sources.length) {
          await loadSource(nextIndex);
          return;
        }
        setStream(null);
        setError(err instanceof Error ? err.message : "This broadcast source could not be loaded.");
      } finally {
        setLoading(false);
      }
    },
    [sources],
  );

  useEffect(() => {
    setStream(null);
    setCurrentSourceIndex(0);
    setError(null);

    if (sources.length > 0) {
      void loadSource(0);
    }
  }, [loadSource, sources]);

  const selectSource = useCallback(
    (index: number) => {
      if (index >= 0 && index < sources.length) {
        void loadSource(index);
      }
    },
    [loadSource, sources.length],
  );

  const failover = useCallback(() => {
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      void loadSource(nextIndex);
    } else {
      setError("Every broadcast source for this match failed to load.");
    }
  }, [currentSourceIndex, loadSource, sources.length]);

  const retry = useCallback(() => {
    void loadSource(currentSourceIndex);
  }, [currentSourceIndex, loadSource]);

  return {
    currentSourceIndex,
    stream,
    loading,
    error,
    sources,
    selectSource,
    failover,
    retry,
  };
}
