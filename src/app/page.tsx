"use client";

import { useState, useEffect, useCallback } from "react";
import NutritionSummary from "@/components/NutritionSummary";
import AddFoodPanel from "@/components/AddFoodPanel";
import FoodLog from "@/components/FoodLog";
import type { Food, LogEntry, MealCategory, NutritionItem } from "@/lib/types";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const fetchEntries = useCallback(async () => {
    const res = await fetch(`/api/log?date=${selectedDate}`);
    const data = await res.json();
    setEntries(data);
  }, [selectedDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleAdd(food: Food, category: MealCategory) {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        food_id: food.id,
        food_name: food.name,
        serving_size: food.servingSize,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        servings: 1,
        meal_category: category,
        date: selectedDate,
      }),
    });
    await fetchEntries();
  }

  async function handleAddNutritionItem(item: NutritionItem, category: MealCategory, servings: number = 1) {
    const food_id = "ai-" + item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        food_id,
        food_name: item.name,
        serving_size: item.servingSize,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        servings,
        meal_category: category,
        date: selectedDate,
      }),
    });
    await fetchEntries();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/log/${id}`, { method: "DELETE" });
    await fetchEntries();
  }

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    if (selectedDate >= todayDate()) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Green Header strip across full-width */}
      <div className="bg-[#0f7944] text-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left side: Logo & Subtitle */}
          <div className="flex items-center gap-3">
            {/* Heart icon in rounded box */}
            <div className="p-2 border border-emerald-500/30 rounded-xl bg-emerald-800/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-emerald-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight">NourishLog</h1>
              <p className="text-[11px] text-emerald-200/80 leading-none mt-0.5">Today</p>
            </div>
          </div>

          {/* Right side: Date controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800/40 transition-colors text-sm font-semibold"
            >
              {"<"}
            </button>
            <div className="flex items-center gap-2 bg-emerald-950/45 border border-emerald-500/20 rounded-xl px-3.5 py-1.5 text-[10px] md:text-sm font-medium tracking-wide">
              <span>{selectedDate}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-emerald-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <button
              onClick={handleNextDay}
              disabled={selectedDate >= todayDate()}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800/40 transition-colors text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <NutritionSummary entries={entries} />
        <AddFoodPanel onAdd={handleAdd} onAddNutritionItem={handleAddNutritionItem} />
        <FoodLog entries={entries} onDelete={handleDelete} />
      </main>
    </div>
  );
}
