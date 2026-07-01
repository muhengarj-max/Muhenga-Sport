export interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular: boolean;
  teams?: {
    home?: { name: string; badge: string };
    away?: { name: string; badge: string };
  };
  sources: { source: string; id: string }[];
}

export type Sport = string | { id?: string; name?: string; slug?: string };

export interface StreamResponse {
  url?: string;
  stream?: string;
  embedUrl?: string;
  iframe?: string;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export interface ResolvedStream {
  type: "hls" | "iframe" | "video";
  url: string;
  raw: StreamResponse;
}
