"use client";

import { useEffect, useState } from "react";
import { normalizeTimestamp } from "@/lib/api";

export default function Countdown({ date }: { date: number }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => {
      const kickoff = normalizeTimestamp(date);
      const diff = kickoff - Date.now();

      if (diff <= 0) {
        const elapsed = Math.abs(diff);
        setLabel(elapsed < 3 * 60 * 60 * 1000 ? "Live now" : "Finished");
        return;
      }

      const minutes = Math.max(0, Math.floor(diff / 60_000));
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;

      if (days > 0) setLabel(`${days}d ${hours}h`);
      else if (hours > 0) setLabel(`${hours}h ${mins}m`);
      else setLabel(`${mins}m`);
    };

    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [date]);

  return <span>{label}</span>;
}
