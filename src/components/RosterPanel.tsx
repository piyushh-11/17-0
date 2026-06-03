import { getRosterNeeds } from "@/lib/validateDraftedTeam";
import type { DraftRosterState } from "@/types/team";

type RosterPanelProps = {
  roster: DraftRosterState;
  filledSlots: number;
  onReset?: () => void;
};

const rosterSlots = [
  ["qb", "QB"],
  ["rb1", "RB1"],
  ["rb2", "RB2"],
  ["wr1", "WR1"],
  ["wr2", "WR2"],
  ["te", "TE"],
  ["k", "K"],
  ["dst", "DST"],
] as const;

const positionNeeds = [
  {
    key: "qb",
    label: "QB",
    total: 1,
  },
  {
    key: "rb",
    label: "RB",
    total: 2,
  },
  {
    key: "wr",
    label: "WR",
    total: 2,
  },
  {
    key: "te",
    label: "TE",
    total: 1,
  },
  {
    key: "k",
    label: "K",
    total: 1,
  },
  {
    key: "dst",
    label: "DST",
    total: 1,
  },
] as const;

export default function RosterPanel({
  roster,
  filledSlots,
  onReset,
}: RosterPanelProps) {
  const progressPercent = (filledSlots / 8) * 100;
  const rosterNeeds = getRosterNeeds(roster);

  return (
    <section className="rounded-lg bg-slate-950 p-5 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">Roster</h2>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            disabled={filledSlots === 0}
            data-testid="reset-draft"
            className="rounded-md border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:border-white/35 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600"
          >
            Reset Draft
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-300">
            {filledSlots} / 8 roster spots filled
          </p>
          <span className="text-sm font-black text-emerald-300">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-emerald-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {positionNeeds.map((need) => {
          const filled = need.total - rosterNeeds[need.key];
          const complete = filled === need.total;

          return (
            <div
              key={need.label}
              className={`rounded-md border px-2 py-2 text-center ${
                complete
                  ? "border-emerald-300/30 bg-emerald-300/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="text-xs font-black text-slate-300">
                {need.label}
              </div>
              <div
                className={`mt-1 text-sm font-black ${
                  complete ? "text-emerald-300" : "text-white"
                }`}
              >
                {filled}/{need.total}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        {rosterSlots.map(([slot, label]) => {
          const player = roster[slot];

          return (
            <div
              key={slot}
              data-testid={`roster-${slot}`}
              className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black text-slate-300">
                  {label}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {player ? player.nflTeam : "Empty"}
                </span>
              </div>
              <div
                className={`mt-1 text-sm font-semibold ${
                  player ? "text-white" : "text-slate-500"
                }`}
              >
                {player ? player.name : "Open slot"}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
