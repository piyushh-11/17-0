export type NFLTeamAbbreviation =
  | "ARI"
  | "ATL"
  | "BAL"
  | "BUF"
  | "CAR"
  | "CHI"
  | "CIN"
  | "CLE"
  | "DAL"
  | "DEN"
  | "DET"
  | "GB"
  | "HOU"
  | "IND"
  | "JAX"
  | "KC"
  | "LAC"
  | "LAR"
  | "LV"
  | "MIA"
  | "MIN"
  | "NE"
  | "NO"
  | "NYG"
  | "NYJ"
  | "PHI"
  | "PIT"
  | "SEA"
  | "SF"
  | "TB"
  | "TEN"
  | "WAS";

export type NFLDraftRosterPosition = "QB" | "RB" | "WR" | "TE" | "K";

export type NFLRosterDataKind = "official-2025-draft-eligible-roster";

export type NFLRosterRatingSource =
  | "madden-fantasy"
  | "madden"
  | "fantasy"
  | "fallback";

export type NFLRosterRatingConfidence = "high" | "medium" | "low";

export type NFLRosterRatings = {
  overall: number;
  maddenOverall: number | null;
  maddenPositionRank: number | null;
  fantasyRank: number | null;
  fantasyPositionRank: number | null;
  fantasyValue: number | null;
  source: NFLRosterRatingSource;
  confidence: NFLRosterRatingConfidence;
};

export type NFLRosterPlayer = {
  id: string;
  name: string;
  team: NFLTeamAbbreviation;
  position: NFLDraftRosterPosition;
  depthChartPosition: string | null;
  jerseyNumber: string | null;
  status: string | null;
  birthDate: string | null;
  height: number | null;
  weight: number | null;
  college: string | null;
  yearsExp: number | null;
  headshotUrl: string | null;
  gsisId: string | null;
  espnId: string | null;
  sportradarId: string | null;
  yahooId: string | null;
  rotowireId: string | null;
  pffId: string | null;
  pfrId: string | null;
  sleeperId: string | null;
  entryYear: number | null;
  rookieYear: number | null;
  draftClub: string | null;
  ratings: NFLRosterRatings;
};

export type NFLTeamRoster = {
  team: NFLTeamAbbreviation;
  sourceTeam: string;
  snapshotWeek: number;
  snapshotGameType: string;
  players: NFLRosterPlayer[];
};

export type NFLRosterMetadata = {
  season: number;
  kind: NFLRosterDataKind;
  generatedAt: string;
  sourceName: string;
  sourceUrl: string;
  sourceNotes: string;
  teamCount: number;
  playerCount: number;
  positionsIncluded: NFLDraftRosterPosition[];
  excludedPositions: string[];
  confidenceFilter?: NFLRosterRatingConfidence;
  removedLowConfidencePlayerCount?: number;
  ratingSources: {
    name: string;
    url: string;
    notes: string;
  }[];
  ratingNotes: string;
};

export type NFLFullRostersData = {
  metadata: NFLRosterMetadata;
  teams: NFLTeamRoster[];
};
