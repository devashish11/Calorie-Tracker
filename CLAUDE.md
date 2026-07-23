# NutriTrack

A single-page calorie and macro tracking web app. No accounts, no cloud — local SQLite persistence, AI food recognition, and a polished UI.

## What it does

- **Quick Add**: Browse or search 25 common foods; click to log instantly
- **Describe Meal**: Type a plain-English description and get AI-estimated nutrition via Gemini
- **Photo**: Upload a meal photo — AI identifies foods and estimates calories; confirm before logging
- Calorie progress bar (green → amber → red as you approach goal)
- Macro progress bars for protein, carbs, and fat vs daily targets
- Meal categories (Breakfast, Lunch, Dinner, Snack) with smart time-of-day default
- Today's log grouped by meal with time stamps and delete
- Everything persists in a local SQLite database across page refreshes

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires `GEMINI_API_KEY` in `.env` for AI features.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Inter font |
| Database | SQLite via `better-sqlite3` |
| AI | Google Gemini 2.5 Flash Lite via `@google/genai` |
| Runtime | Node.js |

## Folder structure

```
src/
  app/
    layout.tsx                  # Root layout — Inter font, metadata
    page.tsx                    # Main page — state, handlers, header
    globals.css                 # Tailwind + theme + scroll-behavior
    api/
      log/route.ts              # GET/POST daily log entries
      log/[id]/route.ts         # DELETE entry
      nutrition/text/route.ts   # POST: text → Gemini → nutrition
      nutrition/image/route.ts  # POST: image → Gemini → nutrition
  components/
    NutritionSummary.tsx        # Calorie bar (color-coded) + macro sub-bars
    AddFoodPanel.tsx            # Tabbed panel + meal category picker
    AITextSearch.tsx            # Describe Meal tab
    AIImageSearch.tsx           # Photo tab (preview + checklist)
    FoodLog.tsx                 # Log grouped by meal category, card entries
  lib/
    types.ts                    # Food, LogEntry, NutritionItem, MealCategory
    foods.ts                    # 25 common foods with full macros
    db.ts                       # SQLite singleton + schema + migration
    gemini.ts                   # Gemini client singleton
data/
  calorie_tracker.db            # Auto-created (gitignored)
docs/
  2026-07-20-initial-build.md
  2026-07-20-gemini-integration.md
  2026-07-20-ai-frontend.md
  2026-07-20-polish.md
```

## API reference

| Route | Method | Body / Params | Returns |
|---|---|---|---|
| `/api/log` | GET | `?date=YYYY-MM-DD` | `LogEntry[]` |
| `/api/log` | POST | `{food_id, food_name, serving_size, calories, protein, carbs, fat, servings, meal_category}` | `LogEntry` |
| `/api/log/:id` | DELETE | — | `{success: true}` |
| `/api/nutrition/text` | POST | `{query: string}` | `NutritionResponse` |
| `/api/nutrition/image` | POST | `FormData { image: File }` | `NutritionResponse` |

## Next Steps

- **Deploy to Vercel** — zero-config deployment; swap SQLite for Turso or Postgres for cloud persistence
- **Food history charts** — weekly calorie and macro trends using a charting library
- **User preferences** — configurable daily calorie and macro goals
- **Barcode scanning** — use device camera to scan barcodes and fetch nutrition from Open Food Facts API
- **Custom foods** — let users add foods not in the built-in catalog
- **Serving size editing** — allow "2 eggs" or "150g" before logging
