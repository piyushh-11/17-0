export type Position = "QB" | "RB" | "WR" | "TE" | "K" | "DST";

export interface BasePlayer {
  id: string;
  name: string;
  position: Position;
  nflTeam: string;
  overall: number;
  consistency: number;
  clutch: number;
  risk: number;
  tags: string[];
}

export interface QBPlayer extends BasePlayer {
  position: "QB";
  ratings: {
    armTalent: number;
    accuracy: number;
    mobility: number;
    decisionMaking: number;
    clutch: number;
    ballSecurity: number;
  };
}

export interface RBPlayer extends BasePlayer {
  position: "RB";
  ratings: {
    rushing: number;
    receiving: number;
    power: number;
    ballSecurity: number;
    durability: number;
  };
}

export interface WRPlayer extends BasePlayer {
  position: "WR";
  ratings: {
    separation: number;
    hands: number;
    deepThreat: number;
    redZone: number;
    consistency: number;
  };
}

export interface TEPlayer extends BasePlayer {
  position: "TE";
  ratings: {
    receiving: number;
    blocking: number;
    redZone: number;
    reliability: number;
  };
}

export interface KPlayer extends BasePlayer {
  position: "K";
  ratings: {
    accuracy: number;
    range: number;
    clutch: number;
  };
}

export interface DSTPlayer extends BasePlayer {
  position: "DST";
  ratings: {
    passRush: number;
    coverage: number;
    runDefense: number;
    turnovers: number;
    discipline: number;
  };
}

export type Player =
  | QBPlayer
  | RBPlayer
  | WRPlayer
  | TEPlayer
  | KPlayer
  | DSTPlayer;
