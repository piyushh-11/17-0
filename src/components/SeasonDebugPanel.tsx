import type { SeasonResult } from "@/types/season";
import type { TeamGrades as TeamGradesData } from "@/types/team";

type SeasonDebugPanelProps = {
  seasonResult: SeasonResult;
};

const gradeLabels: { key: keyof TeamGradesData; label: string }[] = [
  { key: "passingOffense", label: "Passing" },
  { key: "rushingOffense", label: "Rushing" },
  { key: "redZoneOffense", label: "Red Zone" },
  { key: "explosiveness", label: "Explosive" },
  { key: "clockControl", label: "Clock" },
  { key: "defense", label: "Defense" },
  { key: "specialTeams", label: "Special Teams" },
  { key: "clutch", label: "Clutch" },
  { key: "consistency", label: "Consistency" },
  { key: "overallPower", label: "Raw Overall" },
];

function formatNumber(value: number) {
  return value.toFixed(1);
}

export default function SeasonDebugPanel({
  seasonResult,
}: SeasonDebugPanelProps) {
  const shouldShowDebugPanel = process.env.NODE_ENV === "development";

  if (!shouldShowDebugPanel || !seasonResult.debug) {
    return null;
  }

  const debug = seasonResult.debug;

  return (
    <section className="rounded-lg border border-amber-300/30 bg-amber-300/[0.08] p-5 text-white">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
            Development Debug
          </p>
          <h2 className="mt-2 text-2xl font-black">Simulation Balancing</h2>
        </div>
        <p className="text-sm font-bold text-amber-100">
          Final overall power: {formatNumber(debug.overallPower)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-200">
            Raw grades
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {gradeLabels.map((grade) => (
              <div
                key={grade.key}
                className="rounded-md bg-white/[0.06] px-3 py-2"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {grade.label}
                </p>
                <p className="mt-1 text-lg font-black">
                  {formatNumber(debug.rawGrades[grade.key])}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-200">
            Identities
          </h3>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
            Identity bonus
          </p>
          <p className="mt-1 text-3xl font-black">
            +{debug.identityBonus}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {seasonResult.identities.length > 0 ? (
              seasonResult.identities.map((identity) => (
                <span
                  key={identity.id}
                  className="rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black text-emerald-200"
                >
                  {identity.label}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-slate-300">
                No identities detected.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-200">
            Weaknesses
          </h3>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
            Weakness penalty
          </p>
          <p className="mt-1 text-3xl font-black">
            -{debug.weaknessPenalty}
          </p>
          <div className="mt-3 space-y-2">
            {seasonResult.weaknesses.length > 0 ? (
              seasonResult.weaknesses.map((weakness) => (
                <div
                  key={weakness.key}
                  className="rounded-md bg-red-300/10 px-3 py-2 text-sm font-semibold text-red-100"
                >
                  {weakness.label} (-{weakness.penalty})
                </div>
              ))
            ) : (
              <span className="text-sm font-semibold text-slate-300">
                No weaknesses detected.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-md border border-white/10 bg-black/20">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-white/[0.06] text-xs font-black uppercase tracking-wide text-amber-200">
            <tr>
              <th className="px-3 py-3">Week</th>
              <th className="px-3 py-3">Opponent</th>
              <th className="px-3 py-3">Tested grades</th>
              <th className="px-3 py-3 text-right">Matchup</th>
              <th className="px-3 py-3 text-right">Difficulty</th>
              <th className="px-3 py-3 text-right">Variance</th>
              <th className="px-3 py-3 text-right">Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {seasonResult.games.map((game) => (
              <tr key={`${game.week}-${game.opponentName}`}>
                <td className="px-3 py-3 font-black">W{game.week}</td>
                <td className="px-3 py-3 font-semibold">
                  {game.opponentName}
                </td>
                <td className="px-3 py-3 text-slate-300">
                  {game.debug?.testedGrades.join(", ") ?? "n/a"}
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {game.debug ? formatNumber(game.debug.matchupScore) : "n/a"}
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {game.debug
                    ? formatNumber(game.debug.opponentDifficulty)
                    : "n/a"}
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {game.debug ? formatNumber(game.debug.randomVariance) : "n/a"}
                </td>
                <td className="px-3 py-3 text-right font-mono font-black">
                  {game.debug ? formatNumber(game.debug.finalScore) : "n/a"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
