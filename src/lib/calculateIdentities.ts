import type { TeamIdentity } from "@/types/season";
import type { TeamGrades } from "@/types/team";

type IdentityId =
  | "air-attack"
  | "ground-and-pound"
  | "balanced-contender"
  | "defensive-juggernaut"
  | "clutch-killers"
  | "boom-or-bust"
  | "red-zone-machine";

type IdentityDefinition = TeamIdentity & {
  id: IdentityId;
};

const identities: Record<IdentityId, IdentityDefinition> = {
  "air-attack": {
    id: "air-attack",
    label: "Air Attack",
    description:
      "An explosive passing roster built to win through quarterback and receiver firepower.",
  },
  "ground-and-pound": {
    id: "ground-and-pound",
    label: "Ground and Pound",
    description:
      "A physical rushing roster that controls tempo and leans on defensive support.",
  },
  "balanced-contender": {
    id: "balanced-contender",
    label: "Balanced Contender",
    description:
      "A complete roster with no major phase dragging down the season outlook.",
  },
  "defensive-juggernaut": {
    id: "defensive-juggernaut",
    label: "Defensive Juggernaut",
    description:
      "A defense-first roster that can pressure, cover, and force opponents off schedule.",
  },
  "clutch-killers": {
    id: "clutch-killers",
    label: "Clutch Killers",
    description:
      "A late-game roster with enough pressure performers to steal close wins.",
  },
  "boom-or-bust": {
    id: "boom-or-bust",
    label: "Boom-or-Bust",
    description:
      "A volatile roster with huge explosive upside and a shakier weekly floor.",
  },
  "red-zone-machine": {
    id: "red-zone-machine",
    label: "Red Zone Machine",
    description:
      "A scoring-area roster that converts drives when the field gets compressed.",
  },
};

/*
 * Identity bonuses should reward coherent builds without turning every strong
 * roster into a capped 100 overall. They are intentionally small balance
 * nudges; the underlying grades and schedule matchups should still decide most
 * seasons.
 */
const identityBonuses: Record<IdentityId, number> = {
  "air-attack": 1.2,
  "ground-and-pound": 1,
  "balanced-contender": 1.5,
  "defensive-juggernaut": 1.2,
  "clutch-killers": 1,
  "boom-or-bust": 0,
  "red-zone-machine": 0.8,
};

const majorGradeKeys = [
  "passingOffense",
  "rushingOffense",
  "redZoneOffense",
  "explosiveness",
  "clockControl",
  "defense",
  "specialTeams",
  "clutch",
  "consistency",
  "overallPower",
] as const satisfies readonly (keyof TeamGrades)[];

function addIdentity(
  detectedIdentities: TeamIdentity[],
  identityId: IdentityId,
) {
  detectedIdentities.push(identities[identityId]);
}

function isKnownIdentityId(id: string): id is IdentityId {
  return id in identityBonuses;
}

export function calculateIdentities(grades: TeamGrades): TeamIdentity[] {
  const detectedIdentities: TeamIdentity[] = [];

  if (grades.passingOffense >= 92 && grades.explosiveness >= 90) {
    addIdentity(detectedIdentities, "air-attack");
  }

  if (
    grades.rushingOffense >= 90 &&
    grades.clockControl >= 88 &&
    grades.defense >= 85
  ) {
    addIdentity(detectedIdentities, "ground-and-pound");
  }

  if (majorGradeKeys.every((gradeKey) => grades[gradeKey] >= 85)) {
    addIdentity(detectedIdentities, "balanced-contender");
  }

  if (grades.defense >= 92) {
    addIdentity(detectedIdentities, "defensive-juggernaut");
  }

  if (grades.clutch >= 90 && grades.specialTeams >= 88) {
    addIdentity(detectedIdentities, "clutch-killers");
  }

  if (grades.explosiveness >= 88 && grades.consistency < 75) {
    addIdentity(detectedIdentities, "boom-or-bust");
  }

  if (grades.redZoneOffense >= 90) {
    addIdentity(detectedIdentities, "red-zone-machine");
  }

  return detectedIdentities;
}

export function calculateIdentityBonus(detectedIdentities: TeamIdentity[]) {
  return detectedIdentities.reduce((totalBonus, identity) => {
    if (!isKnownIdentityId(identity.id)) {
      return totalBonus;
    }

    return totalBonus + identityBonuses[identity.id];
  }, 0);
}
