import { NextRequest, NextResponse } from "next/server";
import ai, { MODEL } from "@/lib/gemini";
import type { NutritionResponse } from "@/lib/types";

const SYSTEM_PROMPT = `You are a nutrition analysis assistant. Analyze the food in this image and return a JSON object with estimated nutritional information. Identify each distinct food item visible and estimate realistic portion sizes based on what you see.

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
  "description": "Brief description of what you see in the image"
}

All numeric values are per the listed serving size. List each visible food as a separate item and sum the totals.`;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "image file is required" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "image must be jpeg, png, webp, or gif" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: SYSTEM_PROMPT },
          {
            inlineData: {
              mimeType: file.type,
              data: base64,
            },
          },
        ],
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
