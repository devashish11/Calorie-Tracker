# NutriTrack — Project Plan

## What We Built

A full-stack calorie tracker web app built from scratch in one session:

- **Next.js 16 App Router** with TypeScript and Tailwind CSS v4
- **Local SQLite persistence** via `better-sqlite3` — no external database, no accounts, works offline
- **Three ways to log food**:
  - Quick-add from a catalog of 25 common foods with live search
  - AI text lookup — describe a meal in plain English, get macros back
  - AI image analysis — upload a meal photo, Gemini identifies foods, confirm and log
- **Backend API**: `GET/POST /api/log`, `DELETE /api/log/:id`, `POST /api/nutrition/text`, `POST /api/nutrition/image`
- **Google Gemini 2.5 Flash Lite** for both text and vision nutrition analysis
- **Meal categories** (Breakfast, Lunch, Dinner, Snack) with smart time-of-day defaults
- **Professional UI**: Inter font, color-coded calorie progress bar (green → amber → red), per-macro progress bars, grouped food log with card-style entries

## What We Improved

After the initial build, two major polish passes:

**Pass 1 — AI Backend**
- Added `/api/nutrition/text` and `/api/nutrition/image` routes
- Shared Gemini singleton client (`src/lib/gemini.ts`)
- Structured JSON response with individual items + totals

**Pass 2 — AI Frontend**
- Replaced `SearchBar` with a three-tab `AddFoodPanel`
- `AITextSearch`: text input → Gemini → item cards with per-item Add buttons
- `AIImageSearch`: file upload → preview → Gemini → checkbox list → batch add
- Loading spinners, error banners with dismiss, ✓ confirmation states

**Pass 3 — Design & Feature Polish**
- Meal category pills in `AddFoodPanel` with smart default by time of day
- `NutritionSummary` redesigned: large consumed/goal display, color-coded progress bar (green/amber/red at 75%/100%), macro sub-bars vs daily targets
- `FoodLog` redesigned: sections by meal category with emoji icons, time stamps, card-style entries, trash icon delete that reveals on hover
- App renamed to NutriTrack with a top emerald accent bar
- Inter font loaded via `next/font/google`
- `globals.css` theme declaration for font, smooth scroll, branded selection color

## Future Roadmap

| Priority | Feature | Notes |
|---|---|---|
| High | Deploy to Vercel | Swap SQLite → Turso for cloud persistence |
| High | User-configurable goals | Calorie, protein, carbs, fat targets |
| High | Serving size editing | "2 eggs", "150g" before confirming |
| Medium | Weekly history charts | Recharts or Chart.js, calorie + macro trends |
| Medium | Barcode scanning | Open Food Facts API, device camera |
| Medium | Custom food catalog | User-added foods persisted in SQLite |
| Low | Export to CSV | Daily or weekly log download |
| Low | PWA support | Offline-capable, installable on mobile |
