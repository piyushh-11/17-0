import type { DSTPlayer } from "@/types/player";

export type DefenseRatingSource = {
  maddenDefenseOverall: number;
  fantasyRank: number | null;
  fantasyValue: number | null;
  confidence: "high" | "medium";
};

export type RatedDefense = DSTPlayer & {
  source: DefenseRatingSource;
};

// 2025 team D/ST ratings generated from EA Sports Madden NFL 26 player ratings
// blended with FantasyPros 2025 DST VBD rankings. Madden drives the football
// traits; fantasy rank nudges overall value for teams with proven D/ST scoring.
export const defenseRatings: RatedDefense[] = [
  {
    id: "dst-houston-texans",
    name: "Houston Texans D/ST",
    position: "DST",
    nflTeam: "HOU",
    overall: 88.4,
    consistency: 87.4,
    clutch: 82.4,
    risk: 12.6,
    tags: [
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 79.3,
      coverage: 78.6,
      runDefense: 82.6,
      turnovers: 80.4,
      discipline: 84.8
    },
    source: {
      maddenDefenseOverall: 84.3,
      fantasyRank: 2,
      fantasyValue: 41,
      confidence: "high"
    }
  },
  {
    id: "dst-seattle-seahawks",
    name: "Seattle Seahawks D/ST",
    position: "DST",
    nflTeam: "SEA",
    overall: 88,
    consistency: 87.3,
    clutch: 81.1,
    risk: 12.7,
    tags: [
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 79,
      coverage: 77.4,
      runDefense: 83.3,
      turnovers: 78.5,
      discipline: 84.6
    },
    source: {
      maddenDefenseOverall: 83.4,
      fantasyRank: 1,
      fantasyValue: 56,
      confidence: "high"
    }
  },
  {
    id: "dst-pittsburgh-steelers",
    name: "Pittsburgh Steelers D/ST",
    position: "DST",
    nflTeam: "PIT",
    overall: 87.3,
    consistency: 86.5,
    clutch: 81.6,
    risk: 13.5,
    tags: [
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 80.7,
      coverage: 78.1,
      runDefense: 84.3,
      turnovers: 79.8,
      discipline: 84.4
    },
    source: {
      maddenDefenseOverall: 84.1,
      fantasyRank: 5,
      fantasyValue: 14,
      confidence: "high"
    }
  },
  {
    id: "dst-philadelphia-eagles",
    name: "Philadelphia Eagles D/ST",
    position: "DST",
    nflTeam: "PHI",
    overall: 87.1,
    consistency: 85.9,
    clutch: 80.8,
    risk: 14.1,
    tags: [
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 79.1,
      coverage: 77.7,
      runDefense: 82.9,
      turnovers: 78.4,
      discipline: 83
    },
    source: {
      maddenDefenseOverall: 83,
      fantasyRank: 3,
      fantasyValue: 20,
      confidence: "high"
    }
  },
  {
    id: "dst-denver-broncos",
    name: "Denver Broncos D/ST",
    position: "DST",
    nflTeam: "DEN",
    overall: 87,
    consistency: 87.1,
    clutch: 81.8,
    risk: 12.9,
    tags: [
      "Disciplined",
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 78.8,
      coverage: 78.6,
      runDefense: 83.3,
      turnovers: 80.2,
      discipline: 86.4
    },
    source: {
      maddenDefenseOverall: 85,
      fantasyRank: 8,
      fantasyValue: 11,
      confidence: "high"
    }
  },
  {
    id: "dst-minnesota-vikings",
    name: "Minnesota Vikings D/ST",
    position: "DST",
    nflTeam: "MIN",
    overall: 85.8,
    consistency: 85.3,
    clutch: 79.7,
    risk: 14.7,
    tags: [
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 78.9,
      coverage: 75.3,
      runDefense: 82.8,
      turnovers: 78,
      discipline: 83.5
    },
    source: {
      maddenDefenseOverall: 82.4,
      fantasyRank: 6,
      fantasyValue: 14,
      confidence: "high"
    }
  },
  {
    id: "dst-los-angeles-rams",
    name: "Los Angeles Rams D/ST",
    position: "DST",
    nflTeam: "LAR",
    overall: 85.7,
    consistency: 85.4,
    clutch: 80.1,
    risk: 14.6,
    tags: [
      "Fantasy Upside"
    ],
    ratings: {
      passRush: 78.7,
      coverage: 77.8,
      runDefense: 82.7,
      turnovers: 77.6,
      discipline: 83.9
    },
    source: {
      maddenDefenseOverall: 82.8,
      fantasyRank: 7,
      fantasyValue: 14,
      confidence: "high"
    }
  },
  {
    id: "dst-cleveland-browns",
    name: "Cleveland Browns D/ST",
    position: "DST",
    nflTeam: "CLE",
    overall: 85,
    consistency: 84.6,
    clutch: 80.9,
    risk: 15.4,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 78.1,
      coverage: 77.6,
      runDefense: 82.8,
      turnovers: 79.9,
      discipline: 83.3
    },
    source: {
      maddenDefenseOverall: 83.2,
      fantasyRank: 10,
      fantasyValue: 1,
      confidence: "high"
    }
  },
  {
    id: "dst-new-england-patriots",
    name: "New England Patriots D/ST",
    position: "DST",
    nflTeam: "NE",
    overall: 84.9,
    consistency: 84.3,
    clutch: 80.3,
    risk: 15.7,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 76.5,
      coverage: 78.1,
      runDefense: 81.2,
      turnovers: 78.4,
      discipline: 82.8
    },
    source: {
      maddenDefenseOverall: 82.5,
      fantasyRank: 9,
      fantasyValue: 4,
      confidence: "high"
    }
  },
  {
    id: "dst-indianapolis-colts",
    name: "Indianapolis Colts D/ST",
    position: "DST",
    nflTeam: "IND",
    overall: 83.7,
    consistency: 83.7,
    clutch: 80.6,
    risk: 16.3,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 78,
      coverage: 80.1,
      runDefense: 82.2,
      turnovers: 78.9,
      discipline: 83.9
    },
    source: {
      maddenDefenseOverall: 83.9,
      fantasyRank: 16,
      fantasyValue: -11,
      confidence: "high"
    }
  },
  {
    id: "dst-atlanta-falcons",
    name: "Atlanta Falcons D/ST",
    position: "DST",
    nflTeam: "ATL",
    overall: 83.4,
    consistency: 82.7,
    clutch: 79.9,
    risk: 17.3,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 76.1,
      coverage: 78,
      runDefense: 80.9,
      turnovers: 78.7,
      discipline: 81.1
    },
    source: {
      maddenDefenseOverall: 81.3,
      fantasyRank: 11,
      fantasyValue: 0,
      confidence: "high"
    }
  },
  {
    id: "dst-buffalo-bills",
    name: "Buffalo Bills D/ST",
    position: "DST",
    nflTeam: "BUF",
    overall: 83.2,
    consistency: 83.9,
    clutch: 79.5,
    risk: 16.1,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 79.2,
      coverage: 77.5,
      runDefense: 82.9,
      turnovers: 78.1,
      discipline: 84.4
    },
    source: {
      maddenDefenseOverall: 82.4,
      fantasyRank: 14,
      fantasyValue: -6,
      confidence: "high"
    }
  },
  {
    id: "dst-chicago-bears",
    name: "Chicago Bears D/ST",
    position: "DST",
    nflTeam: "CHI",
    overall: 83,
    consistency: 82.9,
    clutch: 80.4,
    risk: 17.1,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 76.4,
      coverage: 78,
      runDefense: 82.1,
      turnovers: 80.1,
      discipline: 82.4
    },
    source: {
      maddenDefenseOverall: 81.6,
      fantasyRank: 13,
      fantasyValue: -2,
      confidence: "high"
    }
  },
  {
    id: "dst-detroit-lions",
    name: "Detroit Lions D/ST",
    position: "DST",
    nflTeam: "DET",
    overall: 82.9,
    consistency: 83.5,
    clutch: 80.8,
    risk: 16.5,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 78.7,
      coverage: 79.2,
      runDefense: 83.4,
      turnovers: 80.2,
      discipline: 84.7
    },
    source: {
      maddenDefenseOverall: 84.1,
      fantasyRank: 19,
      fantasyValue: -18,
      confidence: "high"
    }
  },
  {
    id: "dst-baltimore-ravens",
    name: "Baltimore Ravens D/ST",
    position: "DST",
    nflTeam: "BAL",
    overall: 82.5,
    consistency: 82.9,
    clutch: 81.5,
    risk: 17.1,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.4,
      coverage: 80.3,
      runDefense: 83.7,
      turnovers: 81.4,
      discipline: 84
    },
    source: {
      maddenDefenseOverall: 84.1,
      fantasyRank: 20,
      fantasyValue: -18,
      confidence: "high"
    }
  },
  {
    id: "dst-los-angeles-chargers",
    name: "Los Angeles Chargers D/ST",
    position: "DST",
    nflTeam: "LAC",
    overall: 82.1,
    consistency: 81.8,
    clutch: 79.4,
    risk: 18.2,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.5,
      coverage: 78.5,
      runDefense: 82.2,
      turnovers: 78,
      discipline: 81.1
    },
    source: {
      maddenDefenseOverall: 81.3,
      fantasyRank: 15,
      fantasyValue: -8,
      confidence: "high"
    }
  },
  {
    id: "dst-new-orleans-saints",
    name: "New Orleans Saints D/ST",
    position: "DST",
    nflTeam: "NO",
    overall: 81.9,
    consistency: 81.8,
    clutch: 77.7,
    risk: 18.2,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 76,
      coverage: 74.8,
      runDefense: 81.8,
      turnovers: 76.4,
      discipline: 80.8
    },
    source: {
      maddenDefenseOverall: 79.7,
      fantasyRank: 12,
      fantasyValue: 0,
      confidence: "high"
    }
  },
  {
    id: "dst-kansas-city-chiefs",
    name: "Kansas City Chiefs D/ST",
    position: "DST",
    nflTeam: "KC",
    overall: 80.8,
    consistency: 82,
    clutch: 78.5,
    risk: 18,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.8,
      coverage: 77.7,
      runDefense: 83.5,
      turnovers: 77.5,
      discipline: 84.3
    },
    source: {
      maddenDefenseOverall: 83,
      fantasyRank: 23,
      fantasyValue: -30,
      confidence: "high"
    }
  },
  {
    id: "dst-tampa-bay-buccaneers",
    name: "Tampa Bay Buccaneers D/ST",
    position: "DST",
    nflTeam: "TB",
    overall: 80.6,
    consistency: 81.1,
    clutch: 78.8,
    risk: 18.9,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.2,
      coverage: 77.4,
      runDefense: 81.9,
      turnovers: 78.3,
      discipline: 82.3
    },
    source: {
      maddenDefenseOverall: 81.8,
      fantasyRank: 21,
      fantasyValue: -19,
      confidence: "high"
    }
  },
  {
    id: "dst-jacksonville-jaguars",
    name: "Jacksonville Jaguars D/ST",
    position: "DST",
    nflTeam: "JAX",
    overall: 79.9,
    consistency: 80,
    clutch: 78.1,
    risk: 20,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 76.6,
      coverage: 76.4,
      runDefense: 81.9,
      turnovers: 77.9,
      discipline: 80.1
    },
    source: {
      maddenDefenseOverall: 79.9,
      fantasyRank: null,
      fantasyValue: null,
      confidence: "high"
    }
  },
  {
    id: "dst-miami-dolphins",
    name: "Miami Dolphins D/ST",
    position: "DST",
    nflTeam: "MIA",
    overall: 79.7,
    consistency: 79.4,
    clutch: 77.1,
    risk: 20.6,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 73.7,
      coverage: 75.6,
      runDefense: 81.1,
      turnovers: 76.1,
      discipline: 78.7
    },
    source: {
      maddenDefenseOverall: 78.8,
      fantasyRank: 17,
      fantasyValue: -14,
      confidence: "high"
    }
  },
  {
    id: "dst-carolina-panthers",
    name: "Carolina Panthers D/ST",
    position: "DST",
    nflTeam: "CAR",
    overall: 79.6,
    consistency: 80.1,
    clutch: 76.9,
    risk: 19.9,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 75.8,
      coverage: 74.9,
      runDefense: 80.4,
      turnovers: 76.2,
      discipline: 80.5
    },
    source: {
      maddenDefenseOverall: 79.1,
      fantasyRank: 18,
      fantasyValue: -15,
      confidence: "high"
    }
  },
  {
    id: "dst-green-bay-packers",
    name: "Green Bay Packers D/ST",
    position: "DST",
    nflTeam: "GB",
    overall: 79.4,
    consistency: 80,
    clutch: 78.3,
    risk: 28,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.5,
      coverage: 77.5,
      runDefense: 82.8,
      turnovers: 77.9,
      discipline: 81.6
    },
    source: {
      maddenDefenseOverall: 81.9,
      fantasyRank: 25,
      fantasyValue: -37,
      confidence: "high"
    }
  },
  {
    id: "dst-arizona-cardinals",
    name: "Arizona Cardinals D/ST",
    position: "DST",
    nflTeam: "ARI",
    overall: 78.4,
    consistency: 79.1,
    clutch: 77.7,
    risk: 20.9,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.1,
      coverage: 76.3,
      runDefense: 81.5,
      turnovers: 78,
      discipline: 80.6
    },
    source: {
      maddenDefenseOverall: 80.1,
      fantasyRank: 24,
      fantasyValue: -31,
      confidence: "high"
    }
  },
  {
    id: "dst-tennessee-titans",
    name: "Tennessee Titans D/ST",
    position: "DST",
    nflTeam: "TEN",
    overall: 78.2,
    consistency: 78.8,
    clutch: 76,
    risk: 21.2,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 76,
      coverage: 73.3,
      runDefense: 81.1,
      turnovers: 76,
      discipline: 79.8
    },
    source: {
      maddenDefenseOverall: 78.9,
      fantasyRank: 22,
      fantasyValue: -22,
      confidence: "high"
    }
  },
  {
    id: "dst-san-francisco-49ers",
    name: "San Francisco 49ers D/ST",
    position: "DST",
    nflTeam: "SF",
    overall: 77.4,
    consistency: 78.2,
    clutch: 76.4,
    risk: 29.8,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.8,
      coverage: 74.9,
      runDefense: 82.5,
      turnovers: 76.6,
      discipline: 80.1
    },
    source: {
      maddenDefenseOverall: 80,
      fantasyRank: 27,
      fantasyValue: -39,
      confidence: "high"
    }
  },
  {
    id: "dst-washington-commanders",
    name: "Washington Commanders D/ST",
    position: "DST",
    nflTeam: "WAS",
    overall: 77.2,
    consistency: 78.8,
    clutch: 75.9,
    risk: 29.2,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 78.5,
      coverage: 74.5,
      runDefense: 82.7,
      turnovers: 75.8,
      discipline: 81.9
    },
    source: {
      maddenDefenseOverall: 80.2,
      fantasyRank: 28,
      fantasyValue: -41,
      confidence: "high"
    }
  },
  {
    id: "dst-cincinnati-bengals",
    name: "Cincinnati Bengals D/ST",
    position: "DST",
    nflTeam: "CIN",
    overall: 75.3,
    consistency: 75.6,
    clutch: 74.7,
    risk: 32.4,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 75.7,
      coverage: 73.4,
      runDefense: 79.7,
      turnovers: 75,
      discipline: 76.9
    },
    source: {
      maddenDefenseOverall: 78,
      fantasyRank: 29,
      fantasyValue: -44,
      confidence: "high"
    }
  },
  {
    id: "dst-dallas-cowboys",
    name: "Dallas Cowboys D/ST",
    position: "DST",
    nflTeam: "DAL",
    overall: 74.8,
    consistency: 76.2,
    clutch: 74.2,
    risk: 31.8,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 77.7,
      coverage: 71.5,
      runDefense: 81.6,
      turnovers: 75.2,
      discipline: 79.2
    },
    source: {
      maddenDefenseOverall: 78.2,
      fantasyRank: 31,
      fantasyValue: -57,
      confidence: "high"
    }
  },
  {
    id: "dst-las-vegas-raiders",
    name: "Las Vegas Raiders D/ST",
    position: "DST",
    nflTeam: "LV",
    overall: 74.1,
    consistency: 75,
    clutch: 73.4,
    risk: 33,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 75.9,
      coverage: 73.1,
      runDefense: 80.6,
      turnovers: 73.1,
      discipline: 77
    },
    source: {
      maddenDefenseOverall: 76.7,
      fantasyRank: 30,
      fantasyValue: -54,
      confidence: "high"
    }
  },
  {
    id: "dst-new-york-giants",
    name: "New York Giants D/ST",
    position: "DST",
    nflTeam: "NYG",
    overall: 20.1,
    consistency: 14.4,
    clutch: 6,
    risk: 60,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 1,
      coverage: 1,
      runDefense: 1,
      turnovers: 1,
      discipline: 1
    },
    source: {
      maddenDefenseOverall: 0,
      fantasyRank: 26,
      fantasyValue: -39,
      confidence: "medium"
    }
  },
  {
    id: "dst-new-york-jets",
    name: "New York Jets D/ST",
    position: "DST",
    nflTeam: "NYJ",
    overall: 18.2,
    consistency: 13,
    clutch: 5.5,
    risk: 60,
    tags: [
      "Balanced"
    ],
    ratings: {
      passRush: 1,
      coverage: 1,
      runDefense: 1,
      turnovers: 1,
      discipline: 1
    },
    source: {
      maddenDefenseOverall: 0,
      fantasyRank: 32,
      fantasyValue: -60,
      confidence: "medium"
    }
  }
];
