import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceUrl =
  "https://github.com/nflverse/nflverse-data/releases/download/rosters/roster_2026.csv";
const outputPath = path.join(process.cwd(), "src/data/fullRosters.json");

const teamAliases = new Map([
  ["AZ", "ARI"],
  ["LA", "LAR"],
]);

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += character;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;

  return dataRows.map((dataRow) =>
    Object.fromEntries(
      headers.map((header, index) => [header, dataRow[index] ?? ""]),
    ),
  );
}

function emptyToNull(value) {
  return value === "" || value === undefined ? null : value;
}

function toNumberOrNull(value) {
  if (value === "" || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeTeam(team) {
  return teamAliases.get(team) ?? team;
}

function createFallbackId(row, team, index) {
  const hash = createHash("sha1")
    .update(`${team}-${row.full_name}-${row.position}-${index}`)
    .digest("hex")
    .slice(0, 10);

  return `${team.toLowerCase()}-${slugify(row.full_name || "player")}-${hash}`;
}

async function loadCsvText() {
  const localCsvPath = process.argv[2];

  if (localCsvPath) {
    return readFile(localCsvPath, "utf8");
  }

  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${sourceUrl}: ${response.status}`);
  }

  return response.text();
}

const csvText = await loadCsvText();
const rows = parseCsv(csvText);
const playersByTeam = new Map();

rows
  .filter((row) => row.season === "2026")
  .forEach((row, index) => {
    const team = normalizeTeam(row.team);
    const player = {
      id: row.gsis_id || createFallbackId(row, team, index),
      name: row.full_name,
      team,
      position: row.position,
      depthChartPosition: emptyToNull(row.depth_chart_position),
      jerseyNumber: emptyToNull(row.jersey_number),
      status: emptyToNull(row.status),
      birthDate: emptyToNull(row.birth_date),
      height: toNumberOrNull(row.height),
      weight: toNumberOrNull(row.weight),
      college: emptyToNull(row.college),
      yearsExp: toNumberOrNull(row.years_exp),
      headshotUrl: emptyToNull(row.headshot_url),
      gsisId: emptyToNull(row.gsis_id),
      espnId: emptyToNull(row.espn_id),
      sportradarId: emptyToNull(row.sportradar_id),
      yahooId: emptyToNull(row.yahoo_id),
      rotowireId: emptyToNull(row.rotowire_id),
      pffId: emptyToNull(row.pff_id),
      pfrId: emptyToNull(row.pfr_id),
      sleeperId: emptyToNull(row.sleeper_id),
      entryYear: toNumberOrNull(row.entry_year),
      rookieYear: toNumberOrNull(row.rookie_year),
      draftClub: emptyToNull(row.draft_club),
    };

    if (!playersByTeam.has(team)) {
      playersByTeam.set(team, []);
    }

    playersByTeam.get(team).push(player);
  });

const teams = [...playersByTeam.entries()]
  .sort(([firstTeam], [secondTeam]) => firstTeam.localeCompare(secondTeam))
  .map(([team, players]) => ({
    team,
    players: players.sort((firstPlayer, secondPlayer) => {
      const positionCompare = firstPlayer.position.localeCompare(
        secondPlayer.position,
      );
      if (positionCompare !== 0) return positionCompare;
      return firstPlayer.name.localeCompare(secondPlayer.name);
    }),
  }));

const data = {
  metadata: {
    season: 2026,
    kind: "current-offseason-roster",
    generatedAt: new Date().toISOString(),
    sourceName: "nflverse roster_2026.csv",
    sourceUrl,
    sourceNotes:
      "Current offseason rosters from nflverse. Final 53-man regular-season rosters are not official yet; this dataset intentionally keeps the full offseason player pool by team.",
    teamCount: teams.length,
    playerCount: teams.reduce((total, team) => total + team.players.length, 0),
  },
  teams,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(`${outputPath}.tmp`, `${JSON.stringify(data)}\n`);
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(
  `Generated ${outputPath} with ${data.metadata.playerCount} players across ${data.metadata.teamCount} teams.`,
);
