import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import type { LogEntry } from "@/lib/types";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const entries = db.prepare("SELECT * FROM log_entries WHERE date = ? ORDER BY logged_at ASC").all(date) as LogEntry[];
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { food_id, food_name, serving_size, calories, protein, carbs, fat, servings = 1, meal_category = "Breakfast", date: reqDate } = body;
  const now = new Date().toISOString();
  const date = reqDate ?? now.slice(0, 10);

  if (date > now.slice(0, 10)) {
    return NextResponse.json({ error: "Cannot log entries for a future date" }, { status: 400 });
  }

  const result = db
    .prepare(
      "INSERT INTO log_entries (food_id, food_name, serving_size, calories, protein, carbs, fat, servings, logged_at, date, meal_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(food_id, food_name, serving_size, calories * servings, protein * servings, carbs * servings, fat * servings, servings, now, date, meal_category);

  const entry = db.prepare("SELECT * FROM log_entries WHERE id = ?").get(result.lastInsertRowid) as LogEntry;
  return NextResponse.json(entry, { status: 201 });
}
