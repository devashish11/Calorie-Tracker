"use client";

import { useState } from "react";
import type { NutritionItem, NutritionResponse } from "@/lib/types";

interface Props {
  onAddNutritionItem: (item: NutritionItem, servings?: number) => Promise<void>;
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function AITextSearch({ onAddNutritionItem }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<NutritionItem[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  // States for Editing Calories Popup
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCaloriesValue, setEditCaloriesValue] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);

  const handleOpenEdit = (idx: number, currentCalories: number) => {
    setEditingIndex(idx);
    setEditCaloriesValue(Math.round(currentCalories).toString());
    setEditError(null);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !results) return;
    const val = parseInt(editCaloriesValue);
    if (isNaN(val) || val < 0 || editCaloriesValue.trim() === "") {
      setEditError("Please enter a valid number of calories.");
      return;
    }
    const updated = [...results];
    updated[editingIndex] = { ...updated[editingIndex], calories: val };
    setResults(updated);
    setEditingIndex(null);
    setEditCaloriesValue("");
    setEditError(null);
  };

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setSelected(new Set());
    setQuantities({});
    setDone(false);
    try {
      const res = await fetch("/api/nutrition/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error("Server error");
      const data: NutritionResponse = await res.json();
      const items = data.items;
      setResults(items);
      setSelected(new Set(items.map((_, i) => i)));
      const initialQuantities: Record<number, number> = {};
      items.forEach((_, i) => {
        initialQuantities[i] = 1;
      });
      setQuantities(initialQuantities);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSelected() {
    if (!results) return;
    setAdding(true);
    for (const idx of selected) {
      await onAddNutritionItem(results[idx], quantities[idx] || 1);
    }
    setAdding(false);
    setDone(true);
    setResults(null);
    setQuery("");
  }

  function toggleSelect(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAnalyze} className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. grilled chicken with rice and salad"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          {loading ? <><Spinner /> Analyzing…</> : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {results && results.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No food items detected. Try a more specific description.</p>
      )}

      {done && (
        <p className="text-sm text-emerald-600 font-medium text-center">✓ Items added to your log</p>
      )}

      {results && results.length > 0 && (
        <>
          <ul className="space-y-2">
            {results.map((item, idx) => (
              <li
                key={idx}
                onClick={() => toggleSelect(idx)}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-emerald-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.has(idx)}
                  onChange={() => toggleSelect(idx)}
                  onClick={(e) => e.stopPropagation()}
                  className="accent-emerald-500 w-4 h-4 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.servingSize} · P {Math.round(item.protein * (quantities[idx] || 1))}g · C {Math.round(item.carbs * (quantities[idx] || 1))}g · F {Math.round(item.fat * (quantities[idx] || 1))}g</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantities[idx] !== undefined ? quantities[idx] : 1}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setQuantities((prev) => ({
                        ...prev,
                        [idx]: isNaN(val) ? 1 : val,
                      }));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-400">servings</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(idx, item.calories);
                  }}
                  className="p-1.5 hover:bg-gray-200/60 rounded-lg text-gray-400 hover:text-emerald-600 transition-all shrink-0"
                  title="Edit calories"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-gray-700 shrink-0 w-20 text-right">{Math.round(item.calories * (quantities[idx] || 1))} kcal</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddSelected}
            disabled={selected.size === 0 || adding}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            {adding ? <><Spinner /> Adding…</> : `Add ${selected.size} item${selected.size !== 1 ? "s" : ""} to Log`}
          </button>
        </>
      )}

      {/* Edit Calories Modal */}
      {editingIndex !== null && results && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-gray-800 mb-1">Edit Calories</h3>
            <p className="text-xs text-gray-500 mb-4">Set custom calories for <span className="font-semibold">{results[editingIndex].name}</span></p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  min="0"
                  value={editCaloriesValue}
                  onChange={(e) => setEditCaloriesValue(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  placeholder="e.g. 150"
                  autoFocus
                />
              </div>
              {editError && (
                <p className="text-xs text-red-500 font-medium">{editError}</p>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
