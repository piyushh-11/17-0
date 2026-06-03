import type { Weakness } from "@/types/season";
import type { TeamGrades } from "@/types/team";

export function calculateWeaknesses(grades: TeamGrades): Weakness[] {
  const weaknesses: Weakness[] = [];

  /*
   * Weaknesses are calibrated as meaningful phase holes, not only disastrous
   * failures. A roster can have stars and still lose tough games if one
   * phase sits in the low 80s or below.
   */
  if (grades.passingOffense < 84) {
    weaknesses.push({
      key: "weak-passing-offense",
      label: "Weak passing offense",
      penalty: 4,
    });
  }

  if (grades.rushingOffense < 82) {
    weaknesses.push({
      key: "no-reliable-run-game",
      label: "No reliable run game",
      penalty: 3,
    });
  }

  if (grades.defense < 84) {
    weaknesses.push({
      key: "defense-can-be-exposed",
      label: "Defense can be exposed",
      penalty: 5,
    });
  }

  if (grades.specialTeams < 80) {
    weaknesses.push({
      key: "unreliable-special-teams",
      label: "Unreliable special teams",
      penalty: 2,
    });
  }

  if (grades.redZoneOffense < 82) {
    weaknesses.push({
      key: "poor-red-zone-finishing",
      label: "Poor red zone finishing",
      penalty: 3,
    });
  }

  if (grades.consistency < 78) {
    weaknesses.push({
      key: "high-upset-risk",
      label: "High upset risk",
      penalty: 4,
    });
  }

  if (grades.clutch < 82) {
    weaknesses.push({
      key: "struggles-in-close-games",
      label: "Struggles in close games",
      penalty: 3,
    });
  }

  return weaknesses;
}

export function calculateWeaknessPenalty(weaknesses: Weakness[]) {
  return weaknesses.reduce(
    (totalPenalty, weakness) => totalPenalty + weakness.penalty,
    0,
  );
}
