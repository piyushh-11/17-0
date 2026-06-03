import { isCompleteDraftedTeam } from "@/lib/validateDraftedTeam";
import type {
  DSTPlayer,
  KPlayer,
  Player,
  Position,
  QBPlayer,
  RBPlayer,
  TEPlayer,
  WRPlayer,
} from "@/types/player";
import type { TeamIdentity } from "@/types/season";
import type { DraftedTeam } from "@/types/team";

const draftedTeamStorageKey = "perfect-season-drafted-team";
const simulationSeedStorageKey = "perfect-season-simulation-seed";
const bestRecordStorageKey = "perfect-season-best-record";
const seasonGameCount = 17;

export type BestRecord = {
  record: string;
  wins: number;
  losses: number;
  overallPower: number;
  identities: TeamIdentity[];
  dateAchieved: string;
};

type UnknownRecord = Record<string, unknown>;

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function safeParseJson(value: string | null): unknown | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function loadValidatedItem<T>(
  key: string,
  validate: (value: unknown) => value is T,
): T | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  let storedValue: string | null;

  try {
    storedValue = storage.getItem(key);
  } catch {
    return null;
  }

  const parsedValue = safeParseJson(storedValue);

  if (!validate(parsedValue)) {
    try {
      storage.removeItem(key);
    } catch {
      // Ignore storage cleanup failures; callers still receive a safe null.
    }
    return null;
  }

  return parsedValue;
}

function saveItem(key: string, value: unknown) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can fail in private browsing modes or when quota is full.
  }
}

function clearItem(key: string) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Some privacy modes expose localStorage but reject writes/removals.
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSimulationSeed(value: unknown): value is string {
  return isString(value) && value.length > 0 && value.length <= 200;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isIntegerInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return isNumber(value) && Number.isInteger(value) && value >= min && value <= max;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function hasNumberRatings(
  value: unknown,
  ratingKeys: readonly string[],
): value is UnknownRecord {
  if (!isRecord(value)) {
    return false;
  }

  return ratingKeys.every((key) => isNumber(value[key]));
}

function isBasePlayer(value: unknown, position: Position): value is Player {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.name) &&
    value.position === position &&
    isString(value.nflTeam) &&
    isNumber(value.overall) &&
    isNumber(value.consistency) &&
    isNumber(value.clutch) &&
    isNumber(value.risk) &&
    isStringArray(value.tags)
  );
}

function isQBPlayer(value: unknown): value is QBPlayer {
  return (
    isBasePlayer(value, "QB") &&
    isRecord(value) &&
    hasNumberRatings(value.ratings, [
      "armTalent",
      "accuracy",
      "mobility",
      "decisionMaking",
      "clutch",
      "ballSecurity",
    ])
  );
}

function isRBPlayer(value: unknown): value is RBPlayer {
  return (
    isBasePlayer(value, "RB") &&
    isRecord(value) &&
    hasNumberRatings(value.ratings, [
      "rushing",
      "receiving",
      "power",
      "ballSecurity",
      "durability",
    ])
  );
}

function isWRPlayer(value: unknown): value is WRPlayer {
  return (
    isBasePlayer(value, "WR") &&
    isRecord(value) &&
    hasNumberRatings(value.ratings, [
      "separation",
      "hands",
      "deepThreat",
      "redZone",
      "consistency",
    ])
  );
}

function isTEPlayer(value: unknown): value is TEPlayer {
  return (
    isBasePlayer(value, "TE") &&
    isRecord(value) &&
    hasNumberRatings(value.ratings, [
      "receiving",
      "blocking",
      "redZone",
      "reliability",
    ])
  );
}

function isKPlayer(value: unknown): value is KPlayer {
  return (
    isBasePlayer(value, "K") &&
    isRecord(value) &&
    hasNumberRatings(value.ratings, ["accuracy", "range", "clutch"])
  );
}

function isDSTPlayer(value: unknown): value is DSTPlayer {
  return (
    isBasePlayer(value, "DST") &&
    isRecord(value) &&
    hasNumberRatings(value.ratings, [
      "passRush",
      "coverage",
      "runDefense",
      "turnovers",
      "discipline",
    ])
  );
}

export function isDraftedTeam(value: unknown): value is DraftedTeam {
  if (!isRecord(value)) {
    return false;
  }

  const candidateTeam: Partial<DraftedTeam> = {
    qb: isQBPlayer(value.qb) ? value.qb : undefined,
    rb1: isRBPlayer(value.rb1) ? value.rb1 : undefined,
    rb2: isRBPlayer(value.rb2) ? value.rb2 : undefined,
    wr1: isWRPlayer(value.wr1) ? value.wr1 : undefined,
    wr2: isWRPlayer(value.wr2) ? value.wr2 : undefined,
    te: isTEPlayer(value.te) ? value.te : undefined,
    k: isKPlayer(value.k) ? value.k : undefined,
    dst: isDSTPlayer(value.dst) ? value.dst : undefined,
  };

  return isCompleteDraftedTeam(candidateTeam);
}

function isValidDateString(value: unknown): value is string {
  return isString(value) && Number.isFinite(Date.parse(value));
}

function isTeamIdentity(value: unknown): value is TeamIdentity {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.label) &&
    isString(value.description)
  );
}

export function isBestRecord(value: unknown): value is BestRecord {
  return (
    isRecord(value) &&
    isString(value.record) &&
    isIntegerInRange(value.wins, 0, seasonGameCount) &&
    isIntegerInRange(value.losses, 0, seasonGameCount) &&
    value.wins + value.losses === seasonGameCount &&
    value.record === `${value.wins}-${value.losses}` &&
    isNumber(value.overallPower) &&
    value.overallPower >= 1 &&
    value.overallPower <= 100 &&
    Array.isArray(value.identities) &&
    value.identities.every(isTeamIdentity) &&
    isValidDateString(value.dateAchieved)
  );
}

export function saveDraftedTeam(team: DraftedTeam): void {
  saveItem(draftedTeamStorageKey, team);
  clearSimulationSeed();
}

export function loadDraftedTeam(): DraftedTeam | null {
  const draftedTeam = loadValidatedItem(draftedTeamStorageKey, isDraftedTeam);

  if (!draftedTeam) {
    clearSimulationSeed();
  }

  return draftedTeam;
}

export function clearDraftedTeam(): void {
  clearItem(draftedTeamStorageKey);
  clearSimulationSeed();
}

export function createSimulationSeed(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function saveSimulationSeed(seed: string): void {
  if (!isSimulationSeed(seed)) {
    clearSimulationSeed();
    return;
  }

  saveItem(simulationSeedStorageKey, seed);
}

export function loadSimulationSeed(): string | null {
  return loadValidatedItem(simulationSeedStorageKey, isSimulationSeed);
}

export function clearSimulationSeed(): void {
  clearItem(simulationSeedStorageKey);
}

export function saveBestRecord(best: BestRecord): void {
  saveItem(bestRecordStorageKey, best);
}

export function loadBestRecord(): BestRecord | null {
  return loadValidatedItem(bestRecordStorageKey, isBestRecord);
}

export function clearBestRecord(): void {
  clearItem(bestRecordStorageKey);
}
