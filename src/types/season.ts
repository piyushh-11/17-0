import type { TeamGrades } from "./team";

export type OpponentType = "contender" | "playoff" | "average" | "rebuilding";

export type Opponent = {
  week: number;
  name: string;
  type: OpponentType;
  difficulty: number;
  testedGrades: (keyof TeamGrades)[];
};

export type GameResult = {
  week: number;
  opponentName: string;
  finalScore: number;
  targetScore: number;
  result: "W" | "L";
  explanation: string;
  debug?: {
    testedGrades: (keyof TeamGrades)[];
    matchupScore: number;
    opponentDifficulty: number;
    randomVariance: number;
    finalScore: number;
  };
};

export type TeamIdentity = {
  id: string;
  label: string;
  description: string;
};

export type WeaknessKey =
  | "weak-passing-offense"
  | "no-reliable-run-game"
  | "defense-can-be-exposed"
  | "unreliable-special-teams"
  | "poor-red-zone-finishing"
  | "high-upset-risk"
  | "struggles-in-close-games";

export type Weakness = {
  key: WeaknessKey;
  label: string;
  penalty: number;
};

export type SeasonResult = {
  wins: number;
  losses: number;
  record: string;
  grades: TeamGrades;
  perfectSeason: boolean;
  strengths: string[];
  summary: string;
  games: GameResult[];
  identities: TeamIdentity[];
  weaknesses: Weakness[];
  debug?: {
    rawGrades: TeamGrades;
    identityBonus: number;
    weaknessPenalty: number;
    overallPower: number;
  };
};
