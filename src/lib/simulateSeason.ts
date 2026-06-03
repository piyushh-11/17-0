import { schedule } from "@/data/schedule";
import { calculateTeamGradeBreakdown } from "@/lib/calculateTeamGrades";
import {
  generateGameExplanation,
  generateStrengths,
  generateTeamSummary,
} from "@/lib/generateExplanations";
import type { GameResult, SeasonResult, TeamIdentity } from "@/types/season";
import type { DraftedTeam, TeamGrades } from "@/types/team";

type SimulateSeasonOptions = {
  seed?: string;
};

type RandomNumberGenerator = () => number;

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: string): RandomNumberGenerator {
  let state = hashSeed(seed) || 1;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function getRandomNumber(options?: SimulateSeasonOptions): RandomNumberGenerator {
  /*
   * Seeded simulation is intentionally optional. Normal drafts should keep the
   * game feeling variable, while future daily challenges, debugging, and tests
   * need a reproducible run for the same roster and seed.
   */
  if (options?.seed === undefined) {
    return Math.random;
  }

  return createSeededRandom(options.seed);
}

function getRandomVariance(
  variance: number,
  randomNumber: RandomNumberGenerator,
) {
  return randomNumber() * variance * 2 - variance;
}

function hasIdentity(identities: TeamIdentity[], label: string) {
  return identities.some((identity) => identity.label === label);
}

function calculateVariance(grades: TeamGrades, identities: TeamIdentity[]) {
  /*
   * Variance keeps 17-0 rare. Consistent teams get a narrower range, but even a
   * near-perfect roster can still miss in the hardest late-season games. Shaky
   * and boom-or-bust teams get wider swings so obvious floor problems show up.
   */
  let variance = 7;

  if (grades.consistency >= 92) {
    variance -= 1.5;
  } else if (grades.consistency >= 88) {
    variance -= 1;
  }

  if (grades.consistency < 82) {
    variance += 1.5;
  }

  if (grades.consistency < 76) {
    variance += 1.5;
  }

  if (hasIdentity(identities, "Boom-or-Bust")) {
    variance += 3;
  }

  return variance;
}

function getSeasonSchedule() {
  const seasonSchedule = schedule.slice(0, 17);

  if (seasonSchedule.length !== 17) {
    throw new Error("Season simulation requires exactly 17 scheduled games.");
  }

  return seasonSchedule;
}

export function simulateSeason(
  team: DraftedTeam,
  options?: SimulateSeasonOptions,
): SeasonResult {
  const {
    rawGrades,
    grades,
    identities,
    identityBonus,
    weaknesses,
    weaknessPenalty,
  } = calculateTeamGradeBreakdown(team);
  const strengths = generateStrengths(grades);
  const variance = calculateVariance(grades, identities);
  const randomNumber = getRandomNumber(options);
  const includeDebug = process.env.NODE_ENV === "development";

  const games: GameResult[] = getSeasonSchedule().map((opponent) => {
    const matchupScore = average(
      opponent.testedGrades.map((gradeKey) => grades[gradeKey]),
    );
    const randomVariance = getRandomVariance(variance, randomNumber);
    /*
     * Most of a game comes from the opponent's tested grades, with small global
     * modifiers for overall roster power, clutch, and consistency. This keeps
     * matchup holes visible while making QB-led offense, defense, late-game
     * execution, and week-to-week reliability matter in every game.
     */
    const finalScore = roundToOneDecimal(
      matchupScore * 0.82 +
        grades.overallPower * 0.1 +
        grades.clutch * 0.05 +
        grades.consistency * 0.03 +
        randomVariance,
    );
    const targetScore = opponent.difficulty;
    const result = finalScore >= targetScore ? "W" : "L";

    return {
      week: opponent.week,
      opponentName: opponent.name,
      finalScore,
      targetScore,
      result,
      explanation: generateGameExplanation(grades, opponent, result === "W"),
      ...(includeDebug
        ? {
            debug: {
              testedGrades: opponent.testedGrades,
              matchupScore,
              opponentDifficulty: opponent.difficulty,
              randomVariance,
              finalScore,
            },
          }
        : {}),
    };
  });

  const wins = games.filter((game) => game.result === "W").length;
  const losses = games.length - wins;
  const summary = generateTeamSummary({
    wins,
    losses,
    grades,
    identities,
    weaknesses,
  });

  return {
    wins,
    losses,
    record: `${wins}-${losses}`,
    grades,
    perfectSeason: wins === games.length,
    strengths,
    summary,
    games,
    identities,
    weaknesses,
    ...(includeDebug
      ? {
          debug: {
            rawGrades,
            identityBonus,
            weaknessPenalty,
            overallPower: grades.overallPower,
          },
        }
      : {}),
  };
}
