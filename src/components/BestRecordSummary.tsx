"use client";

import { useEffect, useState } from "react";
import { loadBestRecord } from "@/lib/gameStorage";
import type { BestRecord } from "@/lib/gameStorage";

function formatBestRecordDate(dateAchieved: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateAchieved));
}

export default function BestRecordSummary() {
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(null);
  const [hasLoadedBestRecord, setHasLoadedBestRecord] = useState(false);

  useEffect(() => {
    const loadBestRecordTimeout = window.setTimeout(() => {
      setBestRecord(loadBestRecord());
      setHasLoadedBestRecord(true);
    }, 0);

    return () => window.clearTimeout(loadBestRecordTimeout);
  }, []);

  if (!hasLoadedBestRecord) {
    return null;
  }

  if (!bestRecord) {
    return (
      <section className="mt-10 max-w-xl border-l-4 border-white/20 bg-white/[0.05] p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Best record
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
          No completed season yet. Draft a team and set the first mark.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 max-w-xl border-l-4 border-emerald-400 bg-white/[0.06] p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
        Best record
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <span className="text-5xl font-black text-white">
          {bestRecord.record}
        </span>
        <span className="pb-1 text-sm font-bold text-slate-300">
          {bestRecord.overallPower.toFixed(1)} power
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {bestRecord.identities.slice(0, 3).map((identity) => (
          <span
            key={identity.id}
            className="rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black text-emerald-200"
          >
            {identity.label}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Achieved {formatBestRecordDate(bestRecord.dateAchieved)}
      </p>
    </section>
  );
}
