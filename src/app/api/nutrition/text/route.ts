import { NextRequest, NextResponse } from "next/server";
import ai, { MODEL } from "@/lib/gemini";
import type { NutritionResponse } from "@/lib/types";

const SYSTEM_PROMPT = `You are a nutrition analysis assistant. Given a description of food or a meal, return a JSON object with the estimated nutritional information. Be specific about serving sizes. Use realistic estimates based on standard portion sizes.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "items": [
    {
      "name": "food name",
      "servingSize": "e.g. 200g or 1 cup",
      "calories": 250,
      "protein": 30,
      "carbs": 10,
      "fat": 8
    }
  ],
  "totalCalories": 250,
  "totalProtein": 30,
  "totalCarbs": 10,
  "totalFat": 8,
  "description": "Brief summary of the meal"
}

All numeric values are per the listed serving size. If multiple foods are in the description, list each as a separate item and sum the totals.`;

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\nFood description: ${query}` }],
      },
    ],
  });

  const text = response.text ?? "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  let data: NutritionResponse;
  try {
    data = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: "Failed to parse Gemini response", raw: text }, { status: 502 });
  }

  return NextResponse.json(data);
}
