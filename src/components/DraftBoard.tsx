import PlayerCard from "@/components/PlayerCard";
import type { Player } from "@/types/player";

type DraftBoardProps = {
  players: Player[];
  draftedCount: number;
  getDisabledReason: (player: Player) => string | undefined;
  onDraft: (player: Player) => void;
};

export default function DraftBoard({
  players,
  draftedCount,
  getDisabledReason,
  onDraft,
}: DraftBoardProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-600">
          {players.length} players shown
        </p>
        <p className="text-sm font-bold text-slate-600">
          {draftedCount} drafted. Drafted players are hidden from this list.
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
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
          No available players match this view.
        </div>
      )}
    </section>
  );
}
