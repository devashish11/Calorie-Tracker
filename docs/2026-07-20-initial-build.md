# Initial Build — 2026-07-20

## What was built

A single-page calorie tracker web app from scratch, including:

- 25-food static catalog with full macro data (calories, protein, carbs, fat)
- Live search/filter over the food grid
- One-click food logging
- Real-time macro summary (calorie progress bar + four macro tiles)
- Food log with per-entry delete
- SQLite persistence — data survives page refreshes and browser clears

## Technical choices

### Next.js App Router (not Pages Router)
App Router is the current default for new Next.js projects. Co-locating API routes under `src/app/api/` keeps the backend and frontend in one place with zero extra tooling.

### SQLite via `better-sqlite3`
Alternatives considered: localStorage, JSON file, Prisma + SQLite.

- **localStorage** — lost if the user clears browser storage; not accessible from API routes
- **JSON file** — race conditions with concurrent writes; no query layer
- **Prisma** — adds a migration workflow and a Prisma Client build step for what is essentially one table
- **better-sqlite3** chosen — synchronous API means no async boilerplate in API routes; single binary file at `data/calorie_tracker.db`; zero configuration; instant startup

### Tailwind CSS v4
Installed version was 4.x, which dropped the `tailwind.config.js` file and the `@tailwind` directives in favor of a single `@import "tailwindcss"`. PostCSS is wired via `@tailwindcss/postcss`. No config file is needed for a standard Next.js setup.

### React `useState` + `fetch` (no Zustand/Redux)
The app has one page, one data entity (log entries), and three mutations (add, delete, refetch). A global state library would be over-engineering. All state lives in `page.tsx` and is refreshed by re-fetching after each mutation.

### Static food catalog (not a food API)
A real food API (e.g., USDA FoodData Central) requires network calls, API keys, and rate-limit handling. For a local personal tracker, a 25-item hardcoded catalog is fast, offline-capable, and requires no setup. The `.env` file (with `GEMINI_API_KEY`) is wired for a future AI-powered food search feature.

### Date scoping by `YYYY-MM-DD` column
Log entries store a `date` text column for easy daily filtering. This makes a future weekly history view trivial — just change the query date.

## What was not done (known gaps)

- Custom serving multipliers (all entries are 1×)
- Weekly / historical log view
- User-defined calorie goal (hardcoded to 2,000 kcal)
- AI food search using the Gemini API key in `.env`
- Tests
