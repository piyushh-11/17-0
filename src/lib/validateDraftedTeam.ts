import type { DraftedTeam } from "@/types/team";

const rosterSlotCount = 8;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function hasExpectedPosition(
  player: { id?: unknown; position?: unknown } | undefined,
  position: string,
) {
  return typeof player?.id === "string" && player.position === position;
}

export function isCompleteDraftedTeam(
  team: Partial<DraftedTeam>,
): team is DraftedTeam {
  const { qb, rb1, rb2, wr1, wr2, te, k, dst } = team;

  if (
    !hasExpectedPosition(qb, "QB") ||
    !hasExpectedPosition(rb1, "RB") ||
    !hasExpectedPosition(rb2, "RB") ||
    !hasExpectedPosition(wr1, "WR") ||
    !hasExpectedPosition(wr2, "WR") ||
    !hasExpectedPosition(te, "TE") ||
    !hasExpectedPosition(k, "K") ||
    !hasExpectedPosition(dst, "DST")
  ) {
    return false;
  }

  const playerIds = [
    qb?.id,
    rb1?.id,
    rb2?.id,
    wr1?.id,
    wr2?.id,
    te?.id,
    k?.id,
    dst?.id,
  ];

  return (
    playerIds.every(isString) && new Set(playerIds).size === playerIds.length
  );
}

export function getRosterNeeds(team: Partial<DraftedTeam>): {
  qb: number;
  rb: number;
  wr: number;
  te: number;
  k: number;
  dst: number;
} {
  return {
    qb: hasExpectedPosition(team.qb, "QB") ? 0 : 1,
    rb:
      2 -
      Number(hasExpectedPosition(team.rb1, "RB")) -
      Number(hasExpectedPosition(team.rb2, "RB")),
    wr:
      2 -
      Number(hasExpectedPosition(team.wr1, "WR")) -
      Number(hasExpectedPosition(team.wr2, "WR")),
    te: hasExpectedPosition(team.te, "TE") ? 0 : 1,
    k: hasExpectedPosition(team.k, "K") ? 0 : 1,
    dst: hasExpectedPosition(team.dst, "DST") ? 0 : 1,
  };
}

export function getFilledRosterCount(team: Partial<DraftedTeam>): number {
  const needs = getRosterNeeds(team);
  const openSlots =
    needs.qb + needs.rb + needs.wr + needs.te + needs.k + needs.dst;

  return rosterSlotCount - openSlots;
}
