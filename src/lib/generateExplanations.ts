import type { Opponent, TeamIdentity, Weakness } from "@/types/season";
import type { TeamGrades } from "@/types/team";

type TeamSummaryParams = {
  wins: number;
  losses: number;
  grades: TeamGrades;
  identities: TeamIdentity[];
  weaknesses: Weakness[];
};

const gradeLabels: Record<keyof TeamGrades, string> = {
  passingOffense: "passing offense",
  rushingOffense: "run game",
  redZoneOffense: "red zone offense",
  explosiveness: "explosive playmaking",
  clockControl: "clock control",
  defense: "defense",
  specialTeams: "special teams",
  clutch: "late-game execution",
  consistency: "consistency",
  overallPower: "overall roster power",
};

const winTemplates: Record<keyof TeamGrades, string> = {
  passingOffense:
    "Your passing offense created enough pressure to control the matchup.",
  rushingOffense: "Your run game kept the offense on schedule all game.",
  redZoneOffense:
    "Your red zone execution turned tough drives into winning points.",
  explosiveness:
    "Your explosive playmaking created enough big moments to swing the game.",
  clockControl:
    "Your clock control kept the opponent from finding a rhythm.",
  defense: "Your defense carried the matchup and erased key scoring chances.",
  specialTeams:
    "Your special teams edge helped turn a narrow matchup into a win.",
  clutch: "Your late-game execution was strong enough to close it out.",
  consistency: "Your consistency kept this from becoming an upset spot.",
  overallPower:
    "Your overall roster strength was too much for this opponent.",
};

const lossTemplates: Record<keyof TeamGrades, string> = {
  passingOffense: "Your passing offense was not sharp enough for this matchup.",
  rushingOffense: "Your run game could not create enough reliable offense.",
  redZoneOffense:
    "Your red zone offense left too many scoring chances unfinished.",
  explosiveness:
    "Your explosive playmaking was not enough to create separation.",
  clockControl: "Your clock control was not strong enough to settle the game.",
  defense: "Your defense was not strong enough to slow this opponent down.",
  specialTeams: "Your special teams left too little margin for error.",
  clutch: "Your late-game execution was not good enough in the decisive moments.",
  consistency: "Your consistency rating left you vulnerable in this spot.",
  overallPower: "Your overall roster power did not clear this matchup's bar.",
};

export function generateStrengths(grades: TeamGrades): string[] {
  const strengths: string[] = [];

  if (grades.passingOffense >= 85) strengths.push("Elite passing offense");
  if (grades.rushingOffense >= 85) strengths.push("Dominant run game");
  if (grades.defense >= 85) strengths.push("Elite defense");
  if (grades.clutch >= 85) strengths.push("Excellent in close games");
  if (grades.consistency >= 85) strengths.push("Low upset risk");
  if (grades.redZoneOffense >= 85) {
    strengths.push("Dangerous in the red zone");
  }
  if (grades.specialTeams >= 85) strengths.push("Reliable special teams");
  if (grades.explosiveness >= 85) strengths.push("Explosive playmaking");

  return strengths;
}

function formatList(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0].toLowerCase();
  if (items.length === 2) {
    return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;
  }

  const normalizedItems = items.map((item) => item.toLowerCase());
  const finalItem = normalizedItems[normalizedItems.length - 1];
  return `${normalizedItems.slice(0, -1).join(", ")}, and ${finalItem}`;
}

function getPrimaryWeakness(weaknesses: Weakness[]) {
  return weaknesses.reduce<Weakness | null>((primaryWeakness, weakness) => {
    if (!primaryWeakness || weakness.penalty > primaryWeakness.penalty) {
      return weakness;
    }

    return primaryWeakness;
  }, null);
}

function getMostImportantTestedGrade(
  grades: TeamGrades,
  opponent: Opponent,
) {
  return opponent.testedGrades.reduce((mostImportantGrade, gradeKey) => {
    return grades[gradeKey] < grades[mostImportantGrade]
      ? gradeKey
      : mostImportantGrade;
  }, opponent.testedGrades[0]);
}

export function generateTeamSummary({
  wins,
  losses,
  grades,
  identities,
  weaknesses,
}: TeamSummaryParams): string {
  const strengths = generateStrengths(grades);
  const primaryWeakness = getPrimaryWeakness(weaknesses);
  const identityText = identities[0]?.label.toLowerCase();
  const recordText = `Your team went ${wins}-${losses}`;
  const strengthText = strengths.length > 0 ? formatList(strengths.slice(0, 2)) : "";

  if (wins === 17) {
    return `${recordText} with a perfect season. ${
      strengthText
        ? `The roster leaned on ${strengthText} and held up in every matchup.`
        : "The roster held up in every matchup without a glaring weakness."
    }`;
  }

  if (wins >= 17) {
    return `${recordText} behind ${
      strengthText || identityText || "high-end roster strength"
    }, but ${
      primaryWeakness
        ? primaryWeakness.label.toLowerCase()
        : "the toughest regular-season matchups"
    } kept 17-0 out of reach.`;
  }

  if (wins >= 13) {
    return `${recordText}. The roster had enough firepower to win often, but ${
      primaryWeakness
        ? primaryWeakness.label.toLowerCase()
        : "uneven execution"
    } created too many losses.`;
  }

  return `${recordText}. ${
    strengthText
      ? `Even with ${strengthText},`
      : "Even with some useful pieces,"
  } the roster did not have enough week-to-week answers for a perfect-season run.`;
}

export function generateGameExplanation(
  grades: TeamGrades,
  opponent: Opponent,
  didWin: boolean,
): string {
  const keyGrade = getMostImportantTestedGrade(grades, opponent);

  if (didWin) {
    if (
      opponent.testedGrades.includes("defense") &&
      opponent.testedGrades.includes("clockControl") &&
      grades.defense >= 82 &&
      grades.clockControl >= 82
    ) {
      return "Your defense and clock control were a perfect fit for this matchup.";
    }

    if (
      opponent.testedGrades.includes("passingOffense") &&
      opponent.testedGrades.includes("explosiveness") &&
      grades.passingOffense >= 84
    ) {
      return "Your passing offense created enough explosive plays to survive a shootout.";
    }

    return winTemplates[keyGrade];
  }

  if (opponent.name === "Trap Game" && keyGrade === "consistency") {
    return "Your consistency rating left you vulnerable in a trap game.";
  }

  if (opponent.name === "Elite Offense" && keyGrade === "defense") {
    return "Your defense was not strong enough to slow down an elite offense.";
  }

  return `${lossTemplates[keyGrade]} The ${gradeLabels[keyGrade]} test decided the game.`;
}
