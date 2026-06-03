"use client";

import { useEffect, useMemo, useState } from "react";
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

type RosterSlot = "qb" | "rb1" | "rb2" | "wr1" | "wr2" | "te" | "k" | "dst";

const packSize = 5;

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

type RosterNeeds = ReturnType<typeof getRosterNeeds>;

type DraftPackOptions = {
  allPlayers: Player[];
  draftedIds: Set<string>;
  rosterNeeds: RosterNeeds;
  packSize: number;
  random?: () => number;
};

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

function getOpenPositions(needs: RosterNeeds): Position[] {
  const openPositions: Position[] = [];

  if (needs.qb > 0) openPositions.push("QB");
  if (needs.rb > 0) openPositions.push("RB");
  if (needs.wr > 0) openPositions.push("WR");
  if (needs.te > 0) openPositions.push("TE");
  if (needs.k > 0) openPositions.push("K");
  if (needs.dst > 0) openPositions.push("DST");

  return openPositions;
}

function addUniquePlayer(
  pack: Player[],
  selectedIds: Set<string>,
  player: Player,
) {
  if (selectedIds.has(player.id)) {
    return;
  }

  selectedIds.add(player.id);
  pack.push(player);
}

function shufflePlayers<T>(items: T[], random: () => number) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffledItems[index], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function createDraftPack({
  allPlayers,
  draftedIds,
  rosterNeeds,
  packSize,
  random = Math.random,
}: DraftPackOptions): Player[] {
  const openPositions = shufflePlayers(getOpenPositions(rosterNeeds), random);
  const openPositionSet = new Set<Position>(openPositions);
  const availablePlayers = allPlayers.filter(
    (player) =>
      !draftedIds.has(player.id) && openPositionSet.has(player.position),
  );
  const pack: Player[] = [];
  const selectedIds = new Set<string>();

  for (const position of openPositions) {
    if (pack.length >= packSize) {
      break;
    }

    const positionOptions = shufflePlayers(
      availablePlayers.filter((player) => player.position === position),
      random,
    );

    if (positionOptions[0]) {
      addUniquePlayer(pack, selectedIds, positionOptions[0]);
    }
  }

  const fillOptions = shufflePlayers(
    availablePlayers
      .filter((player) => !selectedIds.has(player.id)),
    random,
  );

  for (const player of fillOptions) {
    if (pack.length >= packSize) {
      break;
    }

    addUniquePlayer(pack, selectedIds, player);
  }

  return pack;
}

function createInitialDraftPack() {
  return createDraftPack({
    allPlayers: players,
    draftedIds: new Set<string>(),
    rosterNeeds: getRosterNeeds({}),
    packSize,
  });
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
  const [roster, setRoster] = useState<DraftRosterState>({});
  const [currentPack, setCurrentPack] = useState<Player[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [packReady, setPackReady] = useState(false);

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
  const openPositions = useMemo(
    () => getOpenPositions(rosterNeeds),
    [rosterNeeds],
  );
  const remainingSlots = slotOrder.length - filledSlots;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentPack(createInitialDraftPack());
      setPackReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

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
    const nextRoster = placePlayer(roster, player);
    const nextFilledSlots = getFilledRosterCount(nextRoster);
    const nextDraftComplete = isCompleteDraftedTeam(nextRoster);

    setRoster(nextRoster);

    if (nextDraftComplete) {
      setCurrentPack([]);
      setRoundNumber(slotOrder.length);
      return;
    }

    const nextDraftedIds = new Set(draftedIds);
    nextDraftedIds.add(player.id);
    setCurrentPack(
      createDraftPack({
        allPlayers: players,
        draftedIds: nextDraftedIds,
        rosterNeeds: getRosterNeeds(nextRoster),
        packSize,
        random: () => Math.random(),
      }),
    );
    setRoundNumber(Math.min(nextFilledSlots + 1, slotOrder.length));
  }

  function handleResetDraft() {
    setRoster({});
    setCurrentPack(
      createDraftPack({
        allPlayers: players,
        draftedIds: new Set<string>(),
        rosterNeeds: getRosterNeeds({}),
        packSize,
        random: () => Math.random(),
      }),
    );
    setRoundNumber(1);
    setPackReady(true);
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
              Card Pack Draft
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-normal">
              Build Your 17-0 Core
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Open one five-player pack each round and pick exactly one player.
              Fill one QB, two RBs, two WRs, one TE, one K, and one D/ST.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="order-2 lg:order-1">
            {!draftComplete ? (
              <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Round {roundNumber} of {slotOrder.length}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Pick 1
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {openPositions.map((position) => (
                      <span
                        key={position}
                        className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800"
                      >
                        Need {position}: {getNeedForPosition(rosterNeeds, position)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${(filledSlots / slotOrder.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}

            {!draftComplete ? (
              <DraftBoard
                players={currentPack}
                draftedCount={draftedIds.size}
                totalPicks={slotOrder.length}
                packReady={packReady}
                getDisabledReason={getDraftDisabledReason}
                onDraft={handleDraft}
                onReset={handleResetDraft}
              />
            ) : null}
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
                  Draft {remainingSlots} more{" "}
                  {remainingSlots === 1 ? "slot" : "slots"} to unlock
                  simulation.
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
