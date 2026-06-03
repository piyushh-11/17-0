import {
  calculateIdentities,
  calculateIdentityBonus,
} from "@/lib/calculateIdentities";
import {
  calculateWeaknesses,
  calculateWeaknessPenalty,
} from "@/lib/calculateWeaknesses";
import type { TeamIdentity, Weakness } from "@/types/season";
import type { DraftedTeam, TeamGrades } from "@/types/team";

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function clampGrade(value: number) {
  return Math.min(100, Math.max(1, value));
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function finalizeGrade(value: number) {
  return roundToOneDecimal(clampGrade(value));
}

export type TeamGradeBreakdown = {
  rawGrades: TeamGrades;
  grades: TeamGrades;
  identities: TeamIdentity[];
  identityBonus: number;
  weaknesses: Weakness[];
  weaknessPenalty: number;
};

export function calculateTeamGradeBreakdown(
  team: DraftedTeam,
): TeamGradeBreakdown {
  const { qb, rb1, rb2, wr1, wr2, te, k, dst } = team;

  const passingOffense = finalizeGrade(
    qb.overall * 0.3 +
      qb.ratings.accuracy * 0.15 +
      qb.ratings.decisionMaking * 0.15 +
      wr1.overall * 0.15 +
      wr2.overall * 0.1 +
      te.ratings.receiving * 0.1 +
      average([rb1.ratings.receiving, rb2.ratings.receiving]) * 0.05,
  );

  const rushingOffense = finalizeGrade(
    rb1.ratings.rushing * 0.35 +
      rb2.ratings.rushing * 0.25 +
      rb1.ratings.power * 0.1 +
      rb2.ratings.power * 0.1 +
      te.ratings.blocking * 0.1 +
      qb.ratings.mobility * 0.1,
  );

  const redZoneOffense = finalizeGrade(
    qb.ratings.decisionMaking * 0.2 +
      rb1.ratings.power * 0.2 +
      rb2.ratings.power * 0.1 +
      wr1.ratings.redZone * 0.2 +
      wr2.ratings.redZone * 0.1 +
      te.ratings.redZone * 0.2,
  );

  const explosiveness = finalizeGrade(
    qb.ratings.armTalent * 0.25 +
      qb.ratings.mobility * 0.1 +
      wr1.ratings.deepThreat * 0.25 +
      wr2.ratings.deepThreat * 0.2 +
      rb1.ratings.receiving * 0.1 +
      rb2.ratings.receiving * 0.05 +
      te.ratings.receiving * 0.05,
  );

  const clockControl = finalizeGrade(
    rb1.ratings.rushing * 0.25 +
      rb2.ratings.rushing * 0.2 +
      rb1.ratings.ballSecurity * 0.15 +
      rb2.ratings.ballSecurity * 0.1 +
      te.ratings.blocking * 0.15 +
      dst.ratings.runDefense * 0.15,
  );

  const defense = finalizeGrade(
    dst.ratings.passRush * 0.25 +
      dst.ratings.coverage * 0.25 +
      dst.ratings.runDefense * 0.2 +
      dst.ratings.turnovers * 0.15 +
      dst.ratings.discipline * 0.15,
  );

  const specialTeams = finalizeGrade(
    k.ratings.accuracy * 0.4 +
      k.ratings.range * 0.25 +
      k.ratings.clutch * 0.25 +
      dst.ratings.discipline * 0.1,
  );

  const clutch = finalizeGrade(
    qb.ratings.clutch * 0.35 +
      k.ratings.clutch * 0.25 +
      wr1.overall * 0.1 +
      wr2.overall * 0.08 +
      te.ratings.reliability * 0.07 +
      dst.ratings.turnovers * 0.15,
  );

  const averageRisk = average([
    qb.risk,
    rb1.risk,
    rb2.risk,
    wr1.risk,
    wr2.risk,
    te.risk,
    k.risk,
    dst.risk,
  ]);

  const consistency = finalizeGrade(
    average([
      qb.consistency,
      rb1.consistency,
      rb2.consistency,
      wr1.consistency,
      wr2.consistency,
      te.consistency,
      k.consistency,
      dst.consistency,
    ]) -
      averageRisk * 0.2,
  );

  const baseOverallPower = finalizeGrade(
    /*
     * Overall power favors the phases that should swing a 17-game NFL-style
     * season: quarterback-driven passing, defense, clutch play, and weekly
     * consistency. Rushing, red-zone play, explosiveness, and special teams
     * still matter, but they should not fully hide a shaky QB or defense.
     */
    passingOffense * 0.2 +
      rushingOffense * 0.11 +
      redZoneOffense * 0.1 +
      explosiveness * 0.09 +
      clockControl * 0.09 +
      defense * 0.18 +
      specialTeams * 0.05 +
      clutch * 0.1 +
      consistency * 0.08,
  );

  const baseGrades: TeamGrades = {
    passingOffense,
    rushingOffense,
    redZoneOffense,
    explosiveness,
    clockControl,
    defense,
    specialTeams,
    clutch,
    consistency,
    overallPower: baseOverallPower,
  };

  const identities = calculateIdentities(baseGrades);
  const identityBonus = calculateIdentityBonus(identities);
  const weaknesses = calculateWeaknesses(baseGrades);
  const weaknessPenalty = calculateWeaknessPenalty(weaknesses);
  const adjustedOverallPower = finalizeGrade(
    baseOverallPower + identityBonus - weaknessPenalty,
  );

  const grades = {
    ...baseGrades,
    overallPower: adjustedOverallPower,
  };

  return {
    rawGrades: baseGrades,
    grades,
    identities,
    identityBonus,
    weaknesses,
    weaknessPenalty,
  };
}

export function calculateTeamGrades(team: DraftedTeam): TeamGrades {
  return calculateTeamGradeBreakdown(team).grades;
}
