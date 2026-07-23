"use client";

import type { LogEntry } from "@/lib/types";

const GOAL_CALORIES = 2000;
const GOAL_PROTEIN = 150;
const GOAL_CARBS = 250;
const GOAL_FAT = 65;

interface Props {
  entries: LogEntry[];
}

interface MacroItemProps {
  label: string;
  value: number;
  goal: number;
  labelColor: string;
  dotColor: string;
}

function MacroColumn({ label, value, goal, labelColor, dotColor }: MacroItemProps) {
  const pct = Math.min((value / goal) * 100, 100);
  return (
    <div className="flex flex-col items-center text-center">
      <span className={`text-[11px] font-bold tracking-wider uppercase ${labelColor}`}>
        {label}
      </span>
      <span className="text-xl font-extrabold text-gray-800 mt-1 leading-none">
        {Math.round(value)}g
      </span>
      <span className="text-xs text-gray-400 mt-1">
        of {goal}g
      </span>
      {/* Solid horizontal progress bar track below */}
      <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: dotColor }}
        />
      </div>
    </div>
  );
}

export default function NutritionSummary({ entries }: Props) {
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calPct = Math.min((totals.calories / GOAL_CALORIES) * 100, 100);
  const remaining = GOAL_CALORIES - totals.calories;
  const isOver = remaining < 0;

  const barColor =
    calPct >= 100 ? "bg-red-500" : calPct >= 75 ? "bg-amber-400" : "bg-[#0f7944]";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
      {/* Top Calories Block */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">CALORIES</p>
          <div className="flex items-baseline mt-1 gap-1">
            <span className="text-5xl font-black text-[#0f7944] tracking-tight">
              {Math.round(totals.calories)}
            </span>
            <span className="text-xl font-medium text-gray-400">
              / {GOAL_CALORIES}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-extrabold text-gray-300 tracking-tight leading-none">
            {isOver ? "+" : ""}{Math.abs(Math.round(remaining))}
          </p>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            {isOver ? "Over goal" : "remaining"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${calPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-1.5">
          <span>0</span>
          <span>{GOAL_CALORIES}</span>
        </div>
      </div>

      {/* Macros Section */}
      <div className="border-t border-gray-100 pt-5 grid grid-cols-3 gap-4">
        <MacroColumn
          label="Protein"
          value={totals.protein}
          goal={GOAL_PROTEIN}
          labelColor="text-sky-500"
          dotColor="#38bdf8"
        />
        <MacroColumn
          label="Carbs"
          value={totals.carbs}
          goal={GOAL_CARBS}
          labelColor="text-amber-500"
          dotColor="#f59e0b"
        />
        <MacroColumn
          label="Fat"
          value={totals.fat}
          goal={GOAL_FAT}
          labelColor="text-rose-500"
          dotColor="#f43f5e"
        />
      </div>
    </div>
  );
}
