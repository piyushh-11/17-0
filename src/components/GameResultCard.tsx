import type { GameResult } from "@/types/season";

type GameResultCardProps = {
  game: GameResult;
};

export default function GameResultCard({ game }: GameResultCardProps) {
  const didWin = game.result === "W";

  return (
    <article
      className={`rounded-lg border p-4 ${
        didWin
          ? "border-emerald-300/20 bg-emerald-300/[0.07]"
          : "border-red-300/20 bg-red-300/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
            Week {game.week}
          </p>
          <h2 className="mt-2 text-lg font-black">vs {game.opponentName}</h2>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-black ${
              didWin ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {game.result}
          </div>
          <div className="mt-1 text-xs font-bold text-slate-300">
            {game.finalScore.toFixed(1)} / {game.targetScore.toFixed(1)}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {game.explanation}
      </p>
    </article>
  );
}
