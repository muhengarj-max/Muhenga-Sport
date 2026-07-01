import axios from "axios";
import type { APIMatch, ResolvedStream, Sport, StreamResponse } from "@/types/match";

export const API_BASE = "https://streamed.pk/api";
const API_TIMEOUT_MS = 30_000;
const API_RETRY_DELAY_MS = 900;

const api = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

type CacheEntry<T> = {
  expiresAt: number;
  data: T;
};

const cache = new Map<string, CacheEntry<unknown>>();

async function cachedGet<T>(path: string, ttlMs = 45_000): Promise<T> {
  const key = path;
  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data as T;
  }

  const data = await requestWithRetry<T>(path);
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

async function requestWithRetry<T>(path: string): Promise<T> {
  try {
    const response = await api.get<T>(path);
    return response.data;
  } catch (firstError) {
    if (!isRetryableApiError(firstError)) {
      throw firstError;
    }

    await new Promise((resolve) => setTimeout(resolve, API_RETRY_DELAY_MS));
    const response = await api.get<T>(path);
    return response.data;
  }
}

function isRetryableApiError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  return (
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT" ||
    error.code === "ECONNRESET" ||
    error.response === undefined ||
    (typeof error.response.status === "number" && error.response.status >= 500)
  );
}

export async function getLiveMatches(): Promise<APIMatch[]> {
  return cachedGet<APIMatch[]>("/matches/live", 20_000);
}

export async function getTodayMatches(): Promise<APIMatch[]> {
  return cachedGet<APIMatch[]>("/matches/all-today", 45_000);
}

export async function getAllMatches(): Promise<APIMatch[]> {
  return cachedGet<APIMatch[]>("/matches/all", 60_000);
}

export async function getMatchesBySport(sport: string): Promise<APIMatch[]> {
  return cachedGet<APIMatch[]>(`/matches/${encodeURIComponent(sport)}`, 45_000);
}

export async function getSports(): Promise<Sport[]> {
  return cachedGet<Sport[]>("/sports", 60_000);
}

export async function getStream(source: string, id: string): Promise<ResolvedStream> {
  const payload = await cachedGet<StreamResponse>(
    `/stream/${encodeURIComponent(source)}/${encodeURIComponent(id)}`,
    10_000,
  );
  return resolveStream(payload);
}

export function getBadgeUrl(id?: string): string | undefined {
  if (!id) return undefined;
  if (/^https?:\/\//i.test(id)) return id;
  const cleanId = id.replace(/\.webp$/i, "").split("/").filter(Boolean).pop() ?? id;
  return `${API_BASE}/images/badge/${encodeURIComponent(cleanId)}.webp`;
}

export function getPosterUrl(match: APIMatch): string | undefined {
  if (match.poster) {
    if (/^https?:\/\//i.test(match.poster)) return match.poster;
    return `${API_BASE}/images/poster/${match.poster}`;
  }

  const home = match.teams?.home?.badge;
  const away = match.teams?.away?.badge;
  if (!home || !away) return undefined;

  const homeBadge = home.replace(/\.webp$/i, "").split("/").filter(Boolean).pop();
  const awayBadge = away.replace(/\.webp$/i, "").split("/").filter(Boolean).pop();

  if (!homeBadge || !awayBadge) return undefined;
  return `${API_BASE}/images/poster/${encodeURIComponent(homeBadge)}/${encodeURIComponent(awayBadge)}.webp`;
}

export function normalizeTimestamp(date: number): number {
  return date < 10_000_000_000 ? date * 1000 : date;
}

export function isMatchLive(match: APIMatch): boolean {
  const kickoff = normalizeTimestamp(match.date);
  const delta = Date.now() - kickoff;
  return delta >= 0 && delta <= 3 * 60 * 60 * 1000;
}

function resolveStream(payload: StreamResponse): ResolvedStream {
  const value =
    firstPlayableString(payload.url) ??
    firstPlayableString(payload.stream) ??
    firstPlayableString(payload.embedUrl) ??
    firstPlayableString(payload.iframe) ??
    firstPlayableString(payload);

  if (!value) {
    throw new Error("The stream endpoint did not return a playable URL.");
  }

  const url = value.trim();
  const lower = url.toLowerCase();
  const type =
    lower.includes(".m3u8") || lower.includes("application/vnd.apple.mpegurl")
      ? "hls"
      : lower.startsWith("<iframe") || lower.includes("/embed/") || lower.includes("iframe")
        ? "iframe"
        : "video";

  return { type, url, raw: payload };
}

function firstPlayableString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const candidate = value.trim();
    if (isPlayableCandidate(candidate)) return candidate;
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstPlayableString(item);
      if (found) return found;
    }
    return undefined;
  }

  if (!value || typeof value !== "object") return undefined;

  for (const item of Object.values(value as Record<string, unknown>)) {
    const found = firstPlayableString(item);
    if (found) return found;
  }

  return undefined;
}

function isPlayableCandidate(value: string): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();

  return (
    lower.startsWith("<iframe") ||
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("blob:") ||
    lower.startsWith("data:video/")
  );
}
