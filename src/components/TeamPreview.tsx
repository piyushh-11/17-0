import { calculateTeamGradeBreakdown } from "@/lib/calculateTeamGrades";
import { generateStrengths } from "@/lib/generateExplanations";
import type { DraftedTeam } from "@/types/team";

type TeamPreviewProps = {
  team: DraftedTeam;
  onSimulate: () => void;
};

const previewGrades = [
  { key: "overallPower", label: "Power" },
  { key: "passingOffense", label: "Pass" },
  { key: "defense", label: "Defense" },
  { key: "clutch", label: "Clutch" },
  { key: "consistency", label: "Floor" },
] as const;

function getGradeTone(score: number) {
  if (score >= 90) return "text-emerald-500";
  if (score >= 82) return "text-cyan-600";
  if (score >= 75) return "text-amber-600";
  return "text-red-600";
}

export default function TeamPreview({ team, onSimulate }: TeamPreviewProps) {
  const { grades, identities, weaknesses } = calculateTeamGradeBreakdown(team);
  const strengths = generateStrengths(grades).slice(0, 3);
  const visibleWeaknesses = weaknesses.slice(0, 3);

  return (
    <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
        Team Preview
      </p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">
        Roster Snapshot
      </h2>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {previewGrades.map((grade) => (
          <div
            key={grade.key}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-3 text-center"
          >
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              {grade.label}
            </p>
            <p
              className={`mt-1 text-lg font-black ${getGradeTone(
                grades[grade.key],
              )}`}
            >
              {grades[grade.key].toFixed(0)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Projected identity
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {identities.length > 0 ? (
            identities.slice(0, 3).map((identity) => (
              <span
                key={identity.id}
                className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700"
              >
                {identity.label}
              </span>
            ))
          ) : (
            <span className="text-sm font-semibold text-slate-600">
              No clear identity yet.
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Obvious strengths
          </p>
          <ul className="mt-2 space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength) => (
                <li
                  key={strength}
                  className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800"
                >
                  {strength}
                </li>
              ))
            ) : (
              <li className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                No elite strengths yet.
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Obvious weaknesses
          </p>
          <ul className="mt-2 space-y-2">
            {visibleWeaknesses.length > 0 ? (
              visibleWeaknesses.map((weakness) => (
                <li
                  key={weakness.key}
                  className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-800"
                >
                  {weakness.label}
                </li>
              ))
            ) : (
              <li className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                No major holes detected.
              </li>
            )}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onSimulate}
        data-testid="simulate-season"
        className="mt-5 w-full rounded-md bg-emerald-400 px-5 py-4 text-sm font-black uppercase tracking-wide text-slate-950 shadow-sm transition hover:bg-emerald-300"
      >
        Simulate Season
      </button>
    </section>
  );
}
