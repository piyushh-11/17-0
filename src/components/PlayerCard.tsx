import type { Player } from "@/types/player";

type PlayerCardProps = {
  player: Player;
  disabledReason?: string;
  onDraft: () => void;
};

function getRiskLevel(risk: number) {
  if (risk >= 75) {
    return { label: "Extreme", className: "bg-red-100 text-red-800" };
  }
  if (risk >= 50) {
    return { label: "High", className: "bg-red-50 text-red-700" };
  }
  if (risk >= 25) {
    return { label: "Medium", className: "bg-amber-50 text-amber-700" };
  }
  return { label: "Low", className: "bg-emerald-50 text-emerald-700" };
}

function getPlayerNote(player: Player) {
  if (player.tags.includes("Boom-Bust")) {
    return "High ceiling player with more week-to-week volatility.";
  }

  if (player.tags.includes("High Risk") || player.tags.includes("Injury Risk")) {
    return "Impact talent, but roster balance matters.";
  }

  if (player.tags.includes("Elite") && player.position === "QB") {
    return "Elite field general who boosts passing offense and clutch performance.";
  }

  switch (player.position) {
    case "QB":
      return "Field general who drives passing offense and clutch performance.";
    case "RB":
      return "Workhorse back who improves rushing offense and clock control.";
    case "WR":
      return "Explosive receiver who raises passing ceiling and big-play potential.";
    case "TE":
      return "Reliable tight end who helps in the red zone and on third downs.";
    case "K":
      return "Reliable kicker who can swing close games.";
    case "DST":
      return "Defense that impacts pressure, turnovers, and team stability.";
  }
}

export default function PlayerCard({
  player,
  disabledReason,
  onDraft,
}: PlayerCardProps) {
  const risk = getRiskLevel(player.risk);

  return (
    <article className="flex min-h-[290px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-slate-100 px-3 py-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Overall
          </p>
          <p className="mt-1 text-lg font-black text-slate-950">
            {player.overall}
          </p>
        </div>
        <div className="rounded-md bg-slate-100 px-3 py-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Consistency
          </p>
          <p className="mt-1 text-lg font-black text-slate-950">
            {player.consistency}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {player.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700"
          >
            {tag}
          </span>
        ))}
        <span
          className={`rounded-md px-2 py-1 text-xs font-bold ${risk.className}`}
        >
          Risk: {risk.label}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
        {getPlayerNote(player)}
      </p>
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
