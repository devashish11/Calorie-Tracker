# AI Frontend Integration — 2026-07-20

## What was added

The "Add Food" section was replaced with a three-tab panel (`AddFoodPanel`) giving users three ways to log food:

| Tab | Flow |
|---|---|
| **Quick Add** | Filter and click from 25 hardcoded foods — unchanged from before |
| **Describe Meal** | Type a free-text description → Gemini returns item cards → click "Add" per item |
| **Photo** | Upload a meal photo → image preview → Gemini analyzes → checklist of detected items → "Add Selected" |

All entries created by AI routes are saved to SQLite via `/api/log` POST and appear in the log immediately.

## New files

| File | Purpose |
|---|---|
| `src/components/AddFoodPanel.tsx` | Tab shell; inlines the quick-add food grid |
| `src/components/AITextSearch.tsx` | Describe Meal tab |
| `src/components/AIImageSearch.tsx` | Photo tab |

## Deleted files

| File | Reason |
|---|---|
| `src/components/SearchBar.tsx` | Quick-add logic moved into `AddFoodPanel.tsx` |

## Changes to existing files

- `src/app/page.tsx` — added `handleAddNutritionItem`, imports `AddFoodPanel` instead of `SearchBar`

## Technical decisions

### Single tabbed panel over separate sections
Three stacked sections would make the page very tall and force the user to scroll past results they don't want. A tab picker hides inactive sections, keeps the page compact, and makes the mental model clear.

### `NutritionItem` → `/api/log` via `handleAddNutritionItem` in `page.tsx`
The `NutritionItem` type already has all macro fields. The only missing piece is a `food_id` slug, generated client-side as `"ai-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")`. This matches the existing `/api/log` POST contract without any backend changes.

### Image checklist defaults all items checked
Gemini's image analysis can miss items or overestimate portions. Defaulting to checked-all lets users quickly uncheck anything they don't want rather than having to manually select each one. The "Add Selected" button shows the count so they know what will be logged.

### Object URL for image preview (not base64)
`URL.createObjectURL` is cheaper than converting to base64 for preview purposes — no memory copy, instant render. The actual base64 conversion happens only when the user clicks "Analyze Photo", and only for the API call.

### `onAddNutritionItem` is `async` and awaited sequentially in image flow
For the image checklist, items are POSTed one at a time in a loop (not `Promise.all`) to avoid parallel writes hitting the SQLite synchronous driver in rapid succession. The "Adding…" spinner covers this.

### Error banner with dismiss button
Errors are surfaced as an inline banner within the panel rather than a toast or modal. This keeps the error in context (next to the input that caused it) and lets the user dismiss without blocking the rest of the page.

## What was not done

- No optimistic UI — log entries only appear after the server confirms
- No offline fallback for AI tabs
- No ability to edit quantities before logging (all added as 1 serving)
