"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SeasonResults from "@/components/SeasonResults";
import { saveBestRecordIfBetter } from "@/lib/bestRecordStorage";
import {
  clearBestRecord,
  clearDraftedTeam,
  loadBestRecord,
  loadDraftedTeam,
  loadSimulationSeed,
} from "@/lib/gameStorage";
import { simulateSeason } from "@/lib/simulateSeason";
import { isCompleteDraftedTeam } from "@/lib/validateDraftedTeam";
import type { BestRecord } from "@/lib/gameStorage";
import type { DraftedTeam } from "@/types/team";

function formatBestRecordDate(dateAchieved: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateAchieved));
}

export default function ResultsExperience() {
  const router = useRouter();
  const [draftedTeam, setDraftedTeam] = useState<DraftedTeam | null>(null);
  const [simulationSeed, setSimulationSeed] = useState<string | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    const loadDraft = window.setTimeout(() => {
      setDraftedTeam(loadDraftedTeam());
      setSimulationSeed(loadSimulationSeed());
      setHasLoadedDraft(true);
    }, 0);

    return () => window.clearTimeout(loadDraft);
  }, []);

  function handleStartOver() {
    clearDraftedTeam();
    router.push("/draft");
  }

  const seasonResult = useMemo(
    () =>
      draftedTeam && isCompleteDraftedTeam(draftedTeam)
        ? simulateSeason(
            draftedTeam,
            simulationSeed ? { seed: simulationSeed } : undefined,
          )
        : null,
    [draftedTeam, simulationSeed],
  );

  useEffect(() => {
    if (!seasonResult) {
      return;
    }

    const saveBestRecord = window.setTimeout(() => {
      const result = saveBestRecordIfBetter(seasonResult);
      setBestRecord(result.bestRecord);
      setIsNewBest(result.isNewBest);
    }, 0);

    return () => window.clearTimeout(saveBestRecord);
  }, [seasonResult]);

  function handleClearBestRecord() {
    clearBestRecord();
    setBestRecord(loadBestRecord());
    setIsNewBest(false);
  }

  if (!hasLoadedDraft) {
    return (
      <main className="min-h-screen bg-[#071013] text-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-8 text-slate-300">
            Loading drafted team...
          </div>
        </div>
      </main>
    );
  }

  if (!draftedTeam || !seasonResult) {
    return (
      <main className="min-h-screen bg-[#071013] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-8">
          <section className="w-full rounded-lg border border-white/10 bg-white/[0.06] p-8 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
              Season Results
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal">
              No drafted team found.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-300">
              Draft a full 8-player roster before simulating a perfect-season
              run.
            </p>
            <Link
              href="/draft"
              data-testid="start-draft-empty"
              className="mt-8 inline-flex rounded-md bg-emerald-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-emerald-300"
            >
              Start Draft
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071013] text-white">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
              Season Results
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Perfect Season Projection
            </h1>
          </div>
          <button
            type="button"
            onClick={handleStartOver}
            data-testid="start-over"
            className="rounded-md border border-white/20 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Draft Again
          </button>
        </div>

        <BestRecordPanel
          bestRecord={bestRecord}
          isNewBest={isNewBest}
          onClearBestRecord={handleClearBestRecord}
        />
        <SeasonResults seasonResult={seasonResult} />
      </div>
    </main>
  );
}

function BestRecordPanel({
  bestRecord,
  isNewBest,
  onClearBestRecord,
}: {
  bestRecord: BestRecord | null;
  isNewBest: boolean;
  onClearBestRecord: () => void;
}) {
  return (
    <section
      className={`rounded-lg border p-5 ${
        isNewBest
          ? "border-emerald-300/40 bg-emerald-300/10"
          : "border-white/10 bg-white/[0.06]"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            {isNewBest ? "New best record" : "Best record"}
          </p>
          {bestRecord ? (
            <>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-black text-white">
                  {bestRecord.record}
                </span>
                <span className="pb-1 text-sm font-bold text-slate-300">
                  {bestRecord.overallPower.toFixed(1)} power
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {bestRecord.identities.slice(0, 4).map((identity) => (
                  <span
                    key={identity.id}
                    className="rounded-md bg-white/[0.08] px-2 py-1 text-xs font-black text-emerald-200"
                  >
                    {identity.label}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Achieved {formatBestRecordDate(bestRecord.dateAchieved)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-300">
              No best record saved yet.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClearBestRecord}
          disabled={!bestRecord}
          data-testid="clear-best-record"
          className="rounded-md border border-white/20 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600"
        >
          Clear Best Record
        </button>
      </div>
    </section>
  );
}
