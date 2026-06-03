import type {
  DSTPlayer,
  KPlayer,
  QBPlayer,
  RBPlayer,
  TEPlayer,
  WRPlayer,
} from "./player";

export type DraftedTeam = {
  qb: QBPlayer;
  rb1: RBPlayer;
  rb2: RBPlayer;
  wr1: WRPlayer;
  wr2: WRPlayer;
  te: TEPlayer;
  k: KPlayer;
  dst: DSTPlayer;
};

export type DraftRosterState = Partial<DraftedTeam>;

export type TeamGrades = {
  passingOffense: number;
  rushingOffense: number;
  redZoneOffense: number;
  explosiveness: number;
  clockControl: number;
  defense: number;
  specialTeams: number;
  clutch: number;
  consistency: number;
  overallPower: number;
};
