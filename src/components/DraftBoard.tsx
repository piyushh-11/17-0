import PlayerCard from "@/components/PlayerCard";
import type { Player } from "@/types/player";

type DraftBoardProps = {
  players: Player[];
  draftedCount: number;
  totalPicks: number;
  packReady: boolean;
  getDisabledReason: (player: Player) => string | undefined;
  onDraft: (player: Player) => void;
  onReset: () => void;
};

export default function DraftBoard({
  players,
  draftedCount,
  totalPicks,
  packReady,
  getDisabledReason,
  onDraft,
  onReset,
}: DraftBoardProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-600">
          Choose one player from this pack.
        </p>
        <p className="text-sm font-bold text-slate-600">
          {draftedCount} / {totalPicks} drafted
        </p>
      </div>
      {players.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => {
            const disabledReason = getDisabledReason(player);

            return (
              <PlayerCard
                key={player.id}
                player={player}
                disabledReason={disabledReason}
                onDraft={() => onDraft(player)}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">
            {packReady
              ? "No valid players are available for the remaining roster slots."
              : "Preparing your draft pack..."}
          </p>
          {packReady ? (
            <button
              type="button"
              onClick={onReset}
              className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800"
            >
              Reset Draft
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}
