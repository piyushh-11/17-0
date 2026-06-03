import fullRostersData from "@/data/fullRosters.json";
import type {
  NFLFullRostersData,
  NFLRosterPlayer,
  NFLTeamAbbreviation,
  NFLTeamRoster,
} from "@/types/roster";

export const fullRosters = fullRostersData as NFLFullRostersData;

export const fullRosterTeams = fullRosters.teams;

export const fullRosterPlayers = fullRosters.teams.flatMap(
  (teamRoster) => teamRoster.players,
);

export function getFullRosterByTeam(
  team: NFLTeamAbbreviation,
): NFLTeamRoster | undefined {
  return fullRosters.teams.find((teamRoster) => teamRoster.team === team);
}

export function getFullRosterPlayersByTeam(
  team: NFLTeamAbbreviation,
): NFLRosterPlayer[] {
  return getFullRosterByTeam(team)?.players ?? [];
}
