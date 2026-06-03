import { defenseRatings } from "@/data/defenseRatings";
import { fullRosterPlayers } from "@/data/fullRosters";
import type {
  KPlayer,
  Player,
  QBPlayer,
  RBPlayer,
  TEPlayer,
  WRPlayer,
} from "@/types/player";
import type { NFLRosterPlayer } from "@/types/roster";

function clampRating(value: number) {
  return Math.max(1, Math.min(100, Math.round(value * 10) / 10));
}

function fantasyBoost(player: NFLRosterPlayer) {
  const rank = player.ratings.fantasyPositionRank;

  if (!rank) {
    return 0;
  }

  if (rank <= 5) return 4;
  if (rank <= 12) return 3;
  if (rank <= 24) return 2;
  if (rank <= 48) return 1;
  return 0;
}

function experienceAdjustment(player: NFLRosterPlayer) {
  const years = player.yearsExp ?? 0;

  if (years === 0) return -2;
  if (years <= 2) return -1;
  if (years >= 8) return 1;
  return 0;
}

function calculateConsistency(player: NFLRosterPlayer) {
  const base = player.ratings.overall;
  const fantasyRank = player.ratings.fantasyPositionRank;
  const rankBump = fantasyRank ? Math.max(0, 5 - fantasyRank / 18) : 0;

  return clampRating(base * 0.82 + 12 + rankBump + experienceAdjustment(player));
}

function calculateClutch(player: NFLRosterPlayer) {
  return clampRating(
    player.ratings.overall * 0.88 + 7 + fantasyBoost(player) * 0.9,
  );
}

function calculateRisk(player: NFLRosterPlayer) {
  const depthRisk = player.ratings.fantasyPositionRank
    ? Math.min(10, player.ratings.fantasyPositionRank / 14)
    : 10;
  const rookieRisk = (player.yearsExp ?? 0) === 0 ? 5 : 0;
  const lowOverallRisk = Math.max(0, 82 - player.ratings.overall) * 0.7;

  return clampRating(100 - calculateConsistency(player) + depthRisk + rookieRisk + lowOverallRisk);
}

function getSharedPlayerFields(player: NFLRosterPlayer) {
  return {
    id: player.id,
    name: player.name,
    nflTeam: player.team,
    overall: clampRating(player.ratings.overall),
    consistency: calculateConsistency(player),
    clutch: calculateClutch(player),
    risk: calculateRisk(player),
    tags: getTags(player),
  };
}

function getTags(player: NFLRosterPlayer) {
  const tags: string[] = [];
  const rating = player.ratings.overall;
  const fantasyRank = player.ratings.fantasyPositionRank;

  if (rating >= 92) tags.push("Elite");
  else if (rating >= 84) tags.push("Starter");
  else tags.push("Depth");

  if (fantasyRank && fantasyRank <= 12) tags.push("Fantasy Edge");
  if (player.ratings.maddenPositionRank && player.ratings.maddenPositionRank <= 10) {
    tags.push("Madden Top 10");
  }
  if ((player.yearsExp ?? 0) === 0) tags.push("Rookie");
  if (calculateRisk(player) >= 40) tags.push("Volatile");

  return tags.slice(0, 4);
}

function createQBPlayer(player: NFLRosterPlayer): QBPlayer {
  const base = player.ratings.overall;
  const boost = fantasyBoost(player);

  return {
    ...getSharedPlayerFields(player),
    position: "QB",
    ratings: {
      armTalent: clampRating(base + boost + 2),
      accuracy: clampRating(base + boost * 0.4),
      mobility: clampRating(base - 2 + boost * 0.5),
      decisionMaking: clampRating(base + experienceAdjustment(player) + boost * 0.5),
      clutch: calculateClutch(player),
      ballSecurity: clampRating(calculateConsistency(player) - 3),
    },
  };
}

function createRBPlayer(player: NFLRosterPlayer): RBPlayer {
  const base = player.ratings.overall;
  const boost = fantasyBoost(player);

  return {
    ...getSharedPlayerFields(player),
    position: "RB",
    ratings: {
      rushing: clampRating(base + boost),
      receiving: clampRating(base - 2 + boost),
      power: clampRating(base - 1 + (player.weight ? Math.max(0, player.weight - 210) / 14 : 0)),
      ballSecurity: clampRating(calculateConsistency(player) - 2),
      durability: clampRating(base + experienceAdjustment(player)),
    },
  };
}

function createWRPlayer(player: NFLRosterPlayer): WRPlayer {
  const base = player.ratings.overall;
  const boost = fantasyBoost(player);

  return {
    ...getSharedPlayerFields(player),
    position: "WR",
    ratings: {
      separation: clampRating(base + boost),
      hands: clampRating(base + calculateConsistency(player) * 0.08 - 6),
      deepThreat: clampRating(base + boost * 0.8),
      redZone: clampRating(base - 1 + boost),
      consistency: calculateConsistency(player),
    },
  };
}

function createTEPlayer(player: NFLRosterPlayer): TEPlayer {
  const base = player.ratings.overall;
  const boost = fantasyBoost(player);

  return {
    ...getSharedPlayerFields(player),
    position: "TE",
    ratings: {
      receiving: clampRating(base + boost),
      blocking: clampRating(base - 4 + (player.weight ? Math.max(0, player.weight - 235) / 18 : 0)),
      redZone: clampRating(base + boost),
      reliability: calculateConsistency(player),
    },
  };
}

function createKPlayer(player: NFLRosterPlayer): KPlayer {
  const base = player.ratings.overall;
  const boost = fantasyBoost(player);

  return {
    ...getSharedPlayerFields(player),
    position: "K",
    ratings: {
      accuracy: clampRating(base + boost),
      range: clampRating(base + boost * 0.6),
      clutch: calculateClutch(player),
    },
  };
}

function createPlayer(player: NFLRosterPlayer): Player {
  switch (player.position) {
    case "QB":
      return createQBPlayer(player);
    case "RB":
      return createRBPlayer(player);
    case "WR":
      return createWRPlayer(player);
    case "TE":
      return createTEPlayer(player);
    case "K":
      return createKPlayer(player);
  }
}

const rosterPlayers = fullRosterPlayers.map(createPlayer);

export const players: Player[] = [...rosterPlayers, ...defenseRatings].sort(
  (firstPlayer, secondPlayer) =>
    secondPlayer.overall - firstPlayer.overall ||
    firstPlayer.position.localeCompare(secondPlayer.position) ||
    firstPlayer.name.localeCompare(secondPlayer.name),
);
