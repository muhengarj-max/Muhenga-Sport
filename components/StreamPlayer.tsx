"use client";

import Hls from "hls.js";
import { Maximize, Pause, Play, RefreshCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { APIMatch } from "@/types/match";
import { useStream } from "@/hooks/useStream";

export default function StreamPlayer({ match }: { match: APIMatch }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { currentSourceIndex, stream, loading, error, sources, selectSource, failover, retry } = useStream(match);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.82);
  const [buffering, setBuffering] = useState(false);
  const [levels, setLevels] = useState<{ label: string; index: number }[]>([]);
  const [quality, setQuality] = useState(-1);

  const streamUrl = stream?.url;
  const isIframe = stream?.type === "iframe";

  const handlePlaybackFailure = useCallback((err: unknown) => {
    console.warn("Playback failed, trying the next available source.", err);
    setPlaying(false);
    setBuffering(false);
    failover();
  }, [failover]);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setPlaying(true);
      setBuffering(false);
    } catch (err) {
      handlePlaybackFailure(err);
    }
  }, [handlePlaybackFailure]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl || isIframe) return;

    setPlaying(false);
    setBuffering(true);
    setLevels([]);
    setQuality(-1);

    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (Hls.isSupported() && stream.type === "hls") {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 18,
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels.map((level, index) => ({ index, label: level.height ? `${level.height}p` : `Level ${index + 1}` })));
        void playVideo();
        setBuffering(false);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          window.setTimeout(() => {
            if (video.readyState < 2) failover();
          }, 2500);
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          failover();
        }
      });
    } else {
      video.src = streamUrl;
      void playVideo();
    }

    const handleWaiting = () => setBuffering(true);
    const handlePlaying = () => setBuffering(false);
    const handleError = () => failover();

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [failover, isIframe, playVideo, stream, streamUrl]);

  const activeSource = sources[currentSourceIndex];
  const sourceLabel = activeSource?.source ?? "Source";

  const iframeMarkup = useMemo(() => {
    if (!streamUrl || !isIframe) return null;
    if (streamUrl.trim().startsWith("<iframe")) return removeIframeSandbox(streamUrl);
    return null;
  }, [isIframe, streamUrl]);

  return (
    <div className="glass overflow-hidden rounded-[8px]">
      <div ref={frameRef} className="group relative aspect-video bg-black">
        {isIframe && streamUrl ? (
          iframeMarkup ? (
            <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: iframeMarkup }} />
          ) : (
            <iframe
              src={streamUrl}
              title={`${match.title} stream`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="h-full w-full border-0"
            />
          )
        ) : (
          <video ref={videoRef} playsInline className="h-full w-full bg-black object-contain" />
        )}

        {(loading || buffering) && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <RefreshCcw className="h-8 w-8 animate-spin text-[#00C853]" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.24em] text-white/70">Buffering broadcast</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 text-center">
            <p className="max-w-md text-sm text-white/70">{error}</p>
            <button onClick={retry} className="mt-4 rounded-[8px] bg-[#00C853] px-4 py-2 text-xs font-black uppercase text-black">
              Retry Stream
            </button>
          </div>
        )}

        {!isIframe && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  if (video.paused) void playVideo();
                  else {
                    video.pause();
                    setPlaying(false);
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white text-black"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>

              <button
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  video.muted = !muted;
                  setMuted(!muted);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/10 text-white"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <input
                aria-label="Volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muted ? 0 : volume}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  const video = videoRef.current;
                  setVolume(next);
                  setMuted(next === 0);
                  if (video) {
                    video.volume = next;
                    video.muted = next === 0;
                  }
                }}
                className="h-1 w-20 accent-[#00C853]"
              />

              {levels.length > 0 && (
                <select
                  aria-label="Quality"
                  value={quality}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setQuality(next);
                    if (hlsRef.current) hlsRef.current.currentLevel = next;
                  }}
                  className="h-10 rounded-[8px] border border-white/10 bg-black px-3 text-xs font-bold text-white"
                >
                  <option value={-1}>Auto</option>
                  {levels.map((level) => (
                    <option key={level.index} value={level.index}>
                      {level.label}
                    </option>
                  ))}
                </select>
              )}

              <button
                aria-label="Fullscreen"
                onClick={() => void frameRef.current?.requestFullscreen()}
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/10 text-white"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00C853]">Active source</p>
          <p className="mt-1 text-sm font-bold text-white/80">{sourceLabel}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {sources.map((source, index) => (
            <button
              key={`${source.source}-${source.id}`}
              onClick={() => selectSource(index)}
              className={`shrink-0 rounded-[8px] border px-3 py-2 text-xs font-black uppercase tracking-wide ${
                currentSourceIndex === index ? "border-[#00C853] bg-[#00C853] text-black" : "border-white/10 bg-white/5 text-white/65"
              }`}
            >
              {source.source}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function removeIframeSandbox(markup: string): string {
  return markup
    .replace(/\s+sandbox=(["']).*?\1/gi, "")
    .replace(/\s+sandbox(?=[\s>])/gi, "");
}
