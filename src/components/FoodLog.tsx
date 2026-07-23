"use client";

import type { LogEntry, MealCategory } from "@/lib/types";

const CATEGORY_ORDER: MealCategory[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const CATEGORY_ICONS: Record<MealCategory, string> = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
  Snack: "🍎",
};

interface Props {
  entries: LogEntry[];
  onDelete: (id: number) => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function FoodLog({ entries, onDelete }: Props) {
  const grouped = CATEGORY_ORDER.reduce<Record<MealCategory, LogEntry[]>>(
    (acc, cat) => {
      acc[cat] = entries.filter((e) => (e.meal_category as MealCategory) === cat);
      return acc;
    },
    { Breakfast: [], Lunch: [], Dinner: [], Snack: [] }
  );

  const hasAny = entries.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-5">Today&apos;s Log</h2>

      {!hasAny && (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">🍽️</p>
          <p className="text-sm font-medium text-gray-500">Nothing logged yet</p>
          <p className="text-xs text-gray-400 mt-1">Use &ldquo;Add Food&rdquo; above to get started</p>
        </div>
      )}

      {hasAny && (
        <div className="space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat];
            if (items.length === 0) return null;

            const sectionCals = Math.round(items.reduce((sum, e) => sum + e.calories, 0));

            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-sm font-semibold text-gray-700">{cat}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">{sectionCals} kcal</span>
                </div>

                <ul className="space-y-2">
                  {items.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 gap-3 group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-800 truncate">{entry.food_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {entry.serving_size} · {formatTime(entry.logged_at)}
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 shrink-0">
                        <span className="font-medium text-blue-500">{Math.round(entry.protein)}g</span>
                        <span className="text-gray-200">·</span>
                        <span className="font-medium text-amber-500">{Math.round(entry.carbs)}g</span>
                        <span className="text-gray-200">·</span>
                        <span className="font-medium text-rose-400">{Math.round(entry.fat)}g</span>
                      </div>

                      <span className="text-sm font-bold text-gray-700 shrink-0 w-16 text-right">
                        {Math.round(entry.calories)} kcal
                      </span>

                      <button
                        onClick={() => onDelete(entry.id)}
                        aria-label="Delete entry"
                        className="shrink-0 text-gray-300 hover:text-red-400 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
