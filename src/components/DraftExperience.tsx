"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DraftBoard from "@/components/DraftBoard";
import RosterPanel from "@/components/RosterPanel";
import TeamGrades from "@/components/TeamGrades";
import TeamPreview from "@/components/TeamPreview";
import { players } from "@/data/players";
import {
  clearDraftedTeam,
  createSimulationSeed,
  saveDraftedTeam,
  saveSimulationSeed,
} from "@/lib/gameStorage";
import {
  getFilledRosterCount,
  getRosterNeeds,
  isCompleteDraftedTeam,
} from "@/lib/validateDraftedTeam";
import type { Player, Position } from "@/types/player";
import type { DraftRosterState } from "@/types/team";

type PositionFilter = Position | "All";
type RosterSlot = "qb" | "rb1" | "rb2" | "wr1" | "wr2" | "te" | "k" | "dst";
type SortOption = "overall" | "consistency" | "risk";

const filters: PositionFilter[] = ["All", "QB", "RB", "WR", "TE", "K", "DST"];
const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Overall", value: "overall" },
  { label: "Consistency", value: "consistency" },
  { label: "Risk", value: "risk" },
];

const slotOrder: RosterSlot[] = [
  "qb",
  "rb1",
  "rb2",
  "wr1",
  "wr2",
  "te",
  "k",
  "dst",
];

function getPositionLimit(position: Position) {
  if (position === "RB" || position === "WR") {
    return 2;
  }

  return 1;
}

function getNeedForPosition(
  needs: ReturnType<typeof getRosterNeeds>,
  position: Position,
) {
  if (position === "RB") return needs.rb;
  if (position === "WR") return needs.wr;
  if (position === "QB") return needs.qb;
  if (position === "TE") return needs.te;
  if (position === "K") return needs.k;
  if (position === "DST") return needs.dst;
}

function isDraftedPlayer(
  player: DraftRosterState[RosterSlot],
): player is Player {
  return player !== undefined;
}

function placePlayer(roster: DraftRosterState, player: Player): DraftRosterState {
  switch (player.position) {
    case "QB":
      return roster.qb ? roster : { ...roster, qb: player };
    case "RB":
      if (!roster.rb1) return { ...roster, rb1: player };
      return roster.rb2 ? roster : { ...roster, rb2: player };
    case "WR":
      if (!roster.wr1) return { ...roster, wr1: player };
      return roster.wr2 ? roster : { ...roster, wr2: player };
    case "TE":
      return roster.te ? roster : { ...roster, te: player };
    case "K":
      return roster.k ? roster : { ...roster, k: player };
    case "DST":
      return roster.dst ? roster : { ...roster, dst: player };
  }
}

export default function DraftExperience() {
  const router = useRouter();
  const [filter, setFilter] = useState<PositionFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("overall");
  const [roster, setRoster] = useState<DraftRosterState>({});

  const draftedPlayers = useMemo(
    () => slotOrder.map((slot) => roster[slot]).filter(isDraftedPlayer),
    [roster],
  );
  const draftedIds = useMemo(
    () => new Set(draftedPlayers.map((player) => player.id)),
    [draftedPlayers],
  );
  const rosterNeeds = useMemo(() => getRosterNeeds(roster), [roster]);
  const draftedTeam = useMemo(
    () => (isCompleteDraftedTeam(roster) ? roster : null),
    [roster],
  );
  const filledSlots = useMemo(() => getFilledRosterCount(roster), [roster]);
  const draftComplete = draftedTeam !== null;

  const filteredPlayers = useMemo(() => {
    const visiblePlayers = players.filter(
      (player) =>
        !draftedIds.has(player.id) &&
        (filter === "All" || player.position === filter),
    );

    return [...visiblePlayers].sort((firstPlayer, secondPlayer) => {
      if (sortOption === "risk") {
        return (
          firstPlayer.risk - secondPlayer.risk ||
          secondPlayer.overall - firstPlayer.overall
        );
      }

      if (sortOption === "consistency") {
        return (
          secondPlayer.consistency - firstPlayer.consistency ||
          secondPlayer.overall - firstPlayer.overall
        );
      }

      return (
        secondPlayer.overall - firstPlayer.overall ||
        secondPlayer.consistency - firstPlayer.consistency
      );
    });
  }, [draftedIds, filter, sortOption]);

  function getDraftDisabledReason(player: Player) {
    if (draftedIds.has(player.id)) {
      return "Already drafted";
    }

    if (getNeedForPosition(rosterNeeds, player.position) === 0) {
      return `${player.position} is full: ${getPositionLimit(player.position)} / ${getPositionLimit(player.position)} roster spots filled.`;
    }

    return undefined;
  }

  function handleDraft(player: Player) {
    if (getDraftDisabledReason(player)) {
      return;
    }

    clearDraftedTeam();
    setRoster((currentRoster) => placePlayer(currentRoster, player));
  }

  function handleResetDraft() {
    setRoster({});
    clearDraftedTeam();
  }

  function handleSimulateSeason() {
    if (!draftedTeam) {
      return;
    }

    saveDraftedTeam(draftedTeam);
    saveSimulationSeed(createSimulationSeed());
    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Draft Room
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-normal">
              Build Your 17-0 Core
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Fill exactly 8 slots: one QB, two RBs, two WRs, one TE, one K,
              and one D/ST. RBs and WRs are assigned in order.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="order-2 lg:order-1">
            <div className="mb-5 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  Filter by position
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => setFilter(position)}
                      data-testid={`filter-${position}`}
                      className={`h-10 rounded-md border px-4 text-sm font-black transition ${
                        filter === position
                          ? "border-slate-950 bg-slate-950 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                      }`}
                      aria-pressed={filter === position}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  Sort players
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSortOption(option.value)}
                      data-testid={`sort-${option.value}`}
                      className={`h-10 rounded-md border px-4 text-sm font-black transition ${
                        sortOption === option.value
                          ? "border-emerald-700 bg-emerald-600 text-white"
                          : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-500"
                      }`}
                      aria-pressed={sortOption === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DraftBoard
              players={filteredPlayers}
              draftedCount={draftedIds.size}
              getDisabledReason={getDraftDisabledReason}
              onDraft={handleDraft}
            />
          </section>

          <aside
            className={`order-1 space-y-6 lg:order-2 lg:self-start ${
              draftComplete ? "" : "lg:sticky lg:top-6"
            }`}
          >
            <RosterPanel
              roster={roster}
              filledSlots={filledSlots}
              onReset={handleResetDraft}
            />
            {draftComplete && draftedTeam ? (
              <TeamPreview
                team={draftedTeam}
                onSimulate={handleSimulateSeason}
              />
            ) : (
              <>
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600 shadow-sm">
                  Draft {slotOrder.length - filledSlots} more{" "}
                  {slotOrder.length - filledSlots === 1 ? "slot" : "slots"} to
                  unlock simulation.
                </div>
                <TeamGrades />
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
