import CopyResultButton from "@/components/CopyResultButton";
import GameResultCard from "@/components/GameResultCard";
import SeasonDebugPanel from "@/components/SeasonDebugPanel";
import TeamGrades from "@/components/TeamGrades";
import type { SeasonResult } from "@/types/season";

type SeasonResultsProps = {
  seasonResult: SeasonResult;
};

function getResultTone(seasonResult: SeasonResult) {
  if (seasonResult.wins === 17) {
    return {
      eyebrow: "Perfect Season",
      title: "17-0",
      description: "A flawless regular season. Every matchup broke your way.",
      className: "border-emerald-300/50 bg-emerald-300/15",
    };
  }

  if (seasonResult.wins >= 18) {
    return {
      eyebrow: "Elite Contender",
      title: seasonResult.record,
      description: "A dominant roster that came within reach of perfection.",
      className: "border-cyan-300/40 bg-cyan-300/10",
    };
  }

  if (seasonResult.wins >= 15) {
    return {
      eyebrow: "Regular-Season Power",
      title: seasonResult.record,
      description:
        "A strong season with a few matchups that exposed pressure points.",
      className: "border-amber-300/40 bg-amber-300/10",
    };
  }

  return {
    eyebrow: "Season Result",
    title: seasonResult.record,
    description: "The losses point to clear roster gaps for the next draft.",
    className: "border-red-300/35 bg-red-300/10",
  };
}

function InsightPanel({
  title,
  emptyText,
  items,
  tone,
}: {
  title: string;
  emptyText: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const markerClass =
    tone === "positive" ? "bg-emerald-300" : "bg-red-300";

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm font-semibold text-slate-200"
            >
              <span
                className={`mt-1 size-2 shrink-0 rounded-full ${markerClass}`}
              />
              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm font-semibold text-slate-300">
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

function HeroResultCard({ seasonResult }: { seasonResult: SeasonResult }) {
  const tone = getResultTone(seasonResult);

  return (
    <section className={`rounded-lg border p-6 shadow-sm ${tone.className}`}>
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
            {tone.eyebrow}
          </p>
          <div className="mt-3 text-7xl font-black leading-none tracking-normal text-white sm:text-8xl">
            {tone.title}
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
            {tone.description}
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center sm:gap-3">
            <div className="rounded-md bg-white/[0.08] p-3 sm:p-4">
              <div className="text-2xl font-black text-emerald-300 sm:text-3xl">
                {seasonResult.wins}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                Wins
              </div>
            </div>
            <div className="rounded-md bg-white/[0.08] p-3 sm:p-4">
              <div className="text-2xl font-black text-red-300 sm:text-3xl">
                {seasonResult.losses}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                Losses
              </div>
            </div>
            <div className="rounded-md bg-white/[0.08] p-3 sm:p-4">
              <div className="text-2xl font-black text-white sm:text-3xl">
                {seasonResult.grades.overallPower.toFixed(1)}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                Power
              </div>
            </div>
          </div>
          <CopyResultButton seasonResult={seasonResult} />
        </div>
      </div>
    </section>
  );
}

export default function SeasonResults({ seasonResult }: SeasonResultsProps) {
  return (
    <div className="space-y-6">
      <HeroResultCard seasonResult={seasonResult} />

      <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
          Team summary
        </p>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-200">
          {seasonResult.summary}
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
          Team identities
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {seasonResult.identities.length > 0 ? (
            seasonResult.identities.map((identity) => (
              <span
                key={identity.id}
                className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm font-black text-emerald-200"
              >
                {identity.label}
              </span>
            ))
          ) : (
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-300">
              No clear identity
            </span>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightPanel
          title="Strengths"
          emptyText="No elite strengths detected."
          items={seasonResult.strengths}
          tone="positive"
        />
        <InsightPanel
          title="Weaknesses"
          emptyText="No major weaknesses detected."
          items={seasonResult.weaknesses.map(
            (weakness) => `${weakness.label} (-${weakness.penalty})`,
          )}
          tone="negative"
        />
      </div>

      <TeamGrades grades={seasonResult.grades} variant="dark" />
      <SeasonDebugPanel seasonResult={seasonResult} />

      <section className="rounded-lg bg-white/[0.04] p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
              Week-by-week results
            </p>
            <h2 className="mt-2 text-2xl font-black">17-game path</h2>
          </div>
          <p className="text-sm font-bold text-slate-300">
            {seasonResult.wins} wins / {seasonResult.losses} losses
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {seasonResult.games.map((game) => (
            <GameResultCard
              key={`${game.week}-${game.opponentName}`}
              game={game}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
