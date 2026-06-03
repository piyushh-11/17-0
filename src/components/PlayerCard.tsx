import type { Player } from "@/types/player";

type PlayerCardProps = {
  player: Player;
  disabledReason?: string;
  onDraft: () => void;
};

export default function PlayerCard({
  player,
  disabledReason,
  onDraft,
}: PlayerCardProps) {
  return (
    <article className="flex min-h-[180px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
            {player.position} - {player.nflTeam}
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950">
            {player.name}
          </h2>
        </div>
        <div className="grid size-14 place-items-center rounded-md bg-slate-950 text-lg font-black text-white">
          {player.overall}
        </div>
      </div>
      {disabledReason ? (
        <p className="mt-3 rounded-md bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
          {disabledReason}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onDraft}
        disabled={Boolean(disabledReason)}
        data-testid={`draft-${player.id}`}
        className="mt-auto w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        {disabledReason ? "Unavailable" : "Draft"}
      </button>
    </article>
  );
}
