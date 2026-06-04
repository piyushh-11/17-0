# NFL Perfect Season Draft Game

A browser-based Next.js game where you draft an 8-player NFL-style roster, simulate a 17-game regular season, and try to finish 17-0.

The game loop is intentionally simple:

1. Start on the landing page.
2. Draft one player from each randomized 5-card pack until the roster is complete.
3. Save the completed roster and simulation seed in browser storage.
4. Simulate a 17-game schedule.
5. Review the record, grades, strengths, weaknesses, game-by-game results, and local best record.

## Tech stack

- [Next.js](https://nextjs.org/) 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

> **Important for contributors:** this repository uses a newer Next.js version with breaking API and convention changes. Before changing framework-level code, read the relevant guide in `node_modules/next/dist/docs/` and follow any deprecation notices.

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Useful scripts:

```bash
npm run dev              # Start the local dev server
npm run build            # Create a production build
npm run start            # Run the production server after building
npm run lint             # Run ESLint
npm run generate:rosters # Regenerate full roster data
```

## Project structure

```text
src/
  app/          Next.js App Router routes, root layout, and global styles
  components/   React UI components for drafting, results, grades, and sharing
  data/         Static roster, defense, player, and schedule data
  lib/          Game logic, simulation, validation, explanations, and storage
  types/        Shared TypeScript domain types
public/         Static public assets
```

### Routes

- `/` renders the landing page with links into the draft and results flows, plus a local best-record summary.
- `/draft` renders the interactive draft experience.
- `/results` loads the saved draft, runs the season simulation, saves a best record if applicable, and renders the result screen.

## How the game works

### Drafting

The draft is managed by `src/components/DraftExperience.tsx`.

A complete roster has 8 slots:

- 1 QB
- 2 RB
- 2 WR
- 1 TE
- 1 K
- 1 D/ST

Each draft round creates a 5-player pack from positions that still have open roster slots. The player is placed into the first available slot for that position. Once all slots are filled, the team can be simulated.

Supporting UI components include:

- `DraftBoard` for the current pack
- `PlayerCard` for individual draft cards
- `RosterPanel` for filled slots and remaining needs
- `TeamPreview` for the completed roster and simulate action

### Validation

Roster validation lives in `src/lib/validateDraftedTeam.ts`.

It checks that:

- Every required slot is filled.
- Every slot has the expected position.
- All drafted player IDs are unique.

The same module also calculates remaining roster needs and filled-slot count.

### Player data

Raw roster data is imported from `src/data/fullRosters.json` through `src/data/fullRosters.ts`.

`src/data/players.ts` converts the raw roster entries into draftable player objects. It derives position-specific ratings, consistency, clutch, risk, and display tags. Defensive/special teams entries are merged in from `src/data/defenseRatings.ts`.

### Team grades

Team scoring lives in `src/lib/calculateTeamGrades.ts`.

The app calculates grades for:

- Passing offense
- Rushing offense
- Red-zone offense
- Explosiveness
- Clock control
- Defense
- Special teams
- Clutch
- Consistency
- Overall power

The grading system uses weighted formulas across the drafted players' ratings. It then applies team identity bonuses and weakness penalties to produce the final overall power.

### Season simulation

Season simulation lives in `src/lib/simulateSeason.ts`.

The simulator:

1. Calculates team grades and identities.
2. Loads the 17-game schedule from `src/data/schedule.ts`.
3. For each opponent, averages the grades that opponent tests.
4. Adds global modifiers for overall power, clutch, and consistency.
5. Applies random variance.
6. Compares the final score against opponent difficulty to determine a win or loss.

Simulation accepts an optional seed. Seeded runs are deterministic for the same roster and seed, which is useful for debugging, testing, or future daily-challenge style features.

### Results and best record

`src/components/ResultsExperience.tsx` loads the saved team and seed, runs the simulation, and renders `SeasonResults`.

Results include:

- Final record
- Wins, losses, and overall power
- Team identities
- Strengths and weaknesses
- Team grades
- Game-by-game results
- Copy-to-clipboard sharing
- Development-only debug details when available

Best-record logic lives in `src/lib/bestRecordStorage.ts`. A new result beats the current best record by:

1. More wins
2. Fewer losses
3. Higher overall power

### Browser storage

`src/lib/gameStorage.ts` handles local persistence. The app stores:

- The drafted team
- The simulation seed
- The best record

Storage is browser-only and uses `localStorage`. The helpers are defensive: they no-op on the server, catch storage failures, validate loaded values, and clear invalid saved data.

## Important files to read first

If you are new to the codebase, read these in order:

1. `src/app/page.tsx` - landing page and entry points
2. `src/app/draft/page.tsx` - draft route wrapper
3. `src/components/DraftExperience.tsx` - draft state and pack generation
4. `src/app/results/page.tsx` - results route wrapper
5. `src/components/ResultsExperience.tsx` - result loading, simulation, and best-record save
6. `src/types/player.ts` - player model and position-specific ratings
7. `src/types/team.ts` - drafted roster and team-grade model
8. `src/types/season.ts` - opponent, game, and season-result model
9. `src/lib/validateDraftedTeam.ts` - roster completion rules
10. `src/lib/calculateTeamGrades.ts` - grade formulas
11. `src/lib/simulateSeason.ts` - game-by-game simulation
12. `src/lib/gameStorage.ts` - local persistence and validation

## Development notes

- This is currently a client-heavy app with no backend or database.
- Saved records are per-browser because they live in `localStorage`.
- The simulation is probabilistic by design, but saved seeds make individual runs reproducible.
- The App Router route files are intentionally thin; most app behavior lives in components and `lib` modules.
- Keep the shared types updated when changing roster shape, player ratings, grades, or season-result fields.
- If you change simulation tuning, review `calculateTeamGrades.ts`, `calculateIdentities.ts`, `calculateWeaknesses.ts`, and `schedule.ts` together so the game remains balanced.

## Learn more

- Start with the local Next.js docs in `node_modules/next/dist/docs/` before modifying framework-level code.
- Review the TypeScript domain types in `src/types/` before changing gameplay logic.
- Review `src/lib/simulateSeason.ts` and `src/data/schedule.ts` together to understand why particular rosters win or lose specific games.
