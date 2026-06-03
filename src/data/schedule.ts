import type { Opponent } from "@/types/season";

export const schedule: Opponent[] = [
  /*
   * Difficulty is tuned for a 17-game regular season. Early games punish
   * flawed rosters, while the final stretch is hard enough that even elite
   * teams need a good roll to finish 17-0.
   */
  {
    week: 1,
    name: "Average Team",
    type: "average",
    difficulty: 72,
    testedGrades: ["overallPower", "consistency"],
  },
  {
    week: 2,
    name: "Shootout Team",
    type: "playoff",
    difficulty: 78,
    testedGrades: ["passingOffense", "explosiveness", "clutch"],
  },
  {
    week: 3,
    name: "Run-Heavy Team",
    type: "average",
    difficulty: 77,
    testedGrades: ["rushingOffense", "clockControl", "defense"],
  },
  {
    week: 4,
    name: "Elite Defense",
    type: "contender",
    difficulty: 84,
    testedGrades: ["passingOffense", "rushingOffense", "redZoneOffense"],
  },
  {
    week: 5,
    name: "Trap Game",
    type: "rebuilding",
    difficulty: 74,
    testedGrades: ["consistency", "clutch"],
  },
  {
    week: 6,
    name: "Rival Game",
    type: "playoff",
    difficulty: 82,
    testedGrades: ["clutch", "defense", "overallPower"],
  },
  {
    week: 7,
    name: "Bad Weather Game",
    type: "average",
    difficulty: 80,
    testedGrades: ["rushingOffense", "clockControl", "specialTeams"],
  },
  {
    week: 8,
    name: "Playoff Contender",
    type: "contender",
    difficulty: 86,
    testedGrades: ["overallPower", "defense", "redZoneOffense"],
  },
  {
    week: 9,
    name: "Mobile QB Team",
    type: "playoff",
    difficulty: 84,
    testedGrades: ["defense", "explosiveness", "clockControl"],
  },
  {
    week: 10,
    name: "Comeback Test",
    type: "playoff",
    difficulty: 85,
    testedGrades: ["passingOffense", "clutch", "explosiveness"],
  },
  {
    week: 11,
    name: "Low-Scoring Game",
    type: "average",
    difficulty: 81,
    testedGrades: ["defense", "specialTeams", "clockControl"],
  },
  {
    week: 12,
    name: "Injury Scare",
    type: "average",
    difficulty: 82,
    testedGrades: ["consistency", "rushingOffense", "overallPower"],
  },
  {
    week: 13,
    name: "Red Zone Battle",
    type: "playoff",
    difficulty: 87,
    testedGrades: ["redZoneOffense", "defense", "clutch"],
  },
  {
    week: 14,
    name: "Road Game",
    type: "playoff",
    difficulty: 88,
    testedGrades: ["consistency", "specialTeams", "overallPower"],
  },
  {
    week: 15,
    name: "Must-Win Game",
    type: "contender",
    difficulty: 94,
    testedGrades: ["clutch", "overallPower", "redZoneOffense"],
  },
  {
    week: 16,
    name: "Elite Offense",
    type: "contender",
    difficulty: 96,
    testedGrades: ["defense", "passingOffense", "explosiveness"],
  },
  {
    week: 17,
    name: "Elite Pass Rush",
    type: "contender",
    difficulty: 99,
    testedGrades: ["passingOffense", "clockControl", "clutch"],
  },
];
