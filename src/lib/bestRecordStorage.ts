import {
  loadBestRecord,
  saveBestRecord,
  type BestRecord,
} from "@/lib/gameStorage";
import type { SeasonResult } from "@/types/season";

export type { BestRecord } from "@/lib/gameStorage";
export {
  clearBestRecord,
  loadBestRecord,
  loadBestRecord as readBestRecord,
  saveBestRecord,
} from "@/lib/gameStorage";

export function createBestRecordFromSeason(
  seasonResult: SeasonResult,
): BestRecord {
  return {
    record: seasonResult.record,
    wins: seasonResult.wins,
    losses: seasonResult.losses,
    overallPower: seasonResult.grades.overallPower,
    identities: seasonResult.identities,
    dateAchieved: new Date().toISOString(),
  };
}

export function isBetterBestRecord(
  candidate: Pick<BestRecord, "wins" | "losses" | "overallPower">,
  currentBest: Pick<BestRecord, "wins" | "losses" | "overallPower"> | null,
) {
  if (!currentBest) return true;
  if (candidate.wins !== currentBest.wins) return candidate.wins > currentBest.wins;
  if (candidate.losses !== currentBest.losses) {
    return candidate.losses < currentBest.losses;
  }
  return candidate.overallPower > currentBest.overallPower;
}

export function saveBestRecordIfBetter(seasonResult: SeasonResult) {
  const currentBest = loadBestRecord();
  const candidate = createBestRecordFromSeason(seasonResult);

  if (isBetterBestRecord(candidate, currentBest)) {
    saveBestRecord(candidate);
    return { bestRecord: candidate, isNewBest: true };
  }

  return { bestRecord: currentBest, isNewBest: false };
}
