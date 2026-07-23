# Gemini API Integration — 2026-07-20

## What was added

Two new backend API routes that use Google Gemini to analyze nutrition:

- **`POST /api/nutrition/text`** — accepts a plain-text meal description (e.g. "grilled chicken with rice and salad") and returns structured nutrition data (calories, protein, carbs, fat) for each identified food item plus running totals.
- **`POST /api/nutrition/image`** — accepts a multipart form-data image upload (JPEG, PNG, WebP, or GIF), sends it to Gemini as a base64-encoded inline blob, and returns the same structured nutrition response based on visual analysis.

Both routes return the same `NutritionResponse` shape:

```json
{
  "items": [
    {
      "name": "...",
      "servingSize": "...",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    }
  ],
  "totalCalories": 0,
  "totalProtein": 0,
  "totalCarbs": 0,
  "totalFat": 0,
  "description": "..."
}
```

## New files

| File                                   | Purpose                                                             |
| -------------------------------------- | ------------------------------------------------------------------- |
| `src/lib/gemini.ts`                    | Gemini client singleton — initialised once, exported for all routes |
| `src/app/api/nutrition/text/route.ts`  | Text-based nutrition lookup                                         |
| `src/app/api/nutrition/image/route.ts` | Image-based nutrition lookup                                        |
| `src/lib/types.ts`                     | Added `NutritionItem` and `NutritionResponse` interfaces            |

## Technical decisions

### Model: `gemini-3.1-flash-lite`

Specified by the brief. Flash Lite is the lowest-latency, lowest-cost Gemini variant — appropriate for a local personal app where response time matters more than maximum accuracy.

### `@google/genai` SDK (not `@google-cloud/vertexai` or raw REST)

The `@google/genai` npm package is the official Gemini API SDK for Node.js and uses the `GEMINI_API_KEY` directly. Vertex AI requires GCP credentials and a project ID — unnecessary overhead for a local app.

### Shared singleton client (`src/lib/gemini.ts`)

The `GoogleGenAI` client is stateless but instantiated once per module load. A singleton pattern avoids re-creating it on every request and makes the API key validation fail fast at startup rather than per-request.

### Prompt engineering: JSON-only system prompt

Both routes instruct Gemini to return only a JSON object with no markdown fences or explanation. The routes also strip any backtick fences defensively with a regex before parsing, handling model responses that include them anyway.

### Image upload: base64 inline data (not File API)

Gemini supports two ways to pass image data: inline base64 or the Files API (upload first, then reference by URI). For small meal photos inline data is simpler — no separate upload step, no URI management, no file lifecycle concerns. The Files API would be preferred for large files (>20MB) or reuse across multiple prompts.

### No streaming

Both routes use `generateContent` (blocking) rather than `generateContentStream`. Streaming is useful for long prose but adds frontend complexity for structured JSON responses — the full JSON must arrive before it can be parsed. Blocking is the right call here.

### Frontend unchanged

The brief explicitly asked for backend-only work this phase. The routes are ready to be wired into the UI in the next step.

## What was not done

- No retry logic on Gemini API errors (502s will surface to the client)
- No caching of identical queries
- No rate limiting
- Frontend not connected yet
