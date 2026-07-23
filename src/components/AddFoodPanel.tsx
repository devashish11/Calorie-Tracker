"use client";

import { useState } from "react";
import { FOODS } from "@/lib/foods";
import AITextSearch from "@/components/AITextSearch";
import AIImageSearch from "@/components/AIImageSearch";
import type { Food, MealCategory, NutritionItem } from "@/lib/types";

type Tab = "quick" | "text" | "image";

interface Props {
  onAdd: (food: Food, category: MealCategory) => Promise<void>;
  onAddNutritionItem: (item: NutritionItem, category: MealCategory, servings?: number) => Promise<void>;
}

const CATEGORIES: { id: MealCategory; label: string; icon: string }[] = [
  { id: "Breakfast", label: "Breakfast", icon: "🍳" },
  { id: "Lunch", label: "Lunch", icon: "🍲" },
  { id: "Dinner", label: "Dinner", icon: "🍌" },
  { id: "Snack", label: "Snack", icon: "🍿" },
];

function defaultCategory(): MealCategory {
  const h = new Date().getHours();
  if (h < 11) return "Breakfast";
  if (h < 14) return "Lunch";
  if (h < 20) return "Dinner";
  return "Snack";
}

export default function AddFoodPanel({ onAdd, onAddNutritionItem }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("quick");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MealCategory>(defaultCategory);

  const filtered = query.trim()
    ? FOODS.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : FOODS;

  const categoryInjectedAdd = (food: Food) => onAdd(food, category);
  const categoryInjectedAddItem = (item: NutritionItem, servings?: number) => onAddNutritionItem(item, category, servings);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Vertical green accent line */}
          <div className="w-1.5 h-6 bg-[#0f7944] rounded-full" />
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Add Food</h2>
        </div>

        {/* Meal category pills */}
        <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    : "text-gray-400 hover:text-gray-600 border border-transparent"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab switcher styled as full-width box with grey background */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
        {/* Search Tab */}
        <button
          onClick={() => setActiveTab("quick")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "quick"
              ? "bg-white text-[#0f7944] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100/50"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"
            />
          </svg>
          Search
        </button>

        {/* Describe Tab */}
        <button
          onClick={() => setActiveTab("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "text"
              ? "bg-white text-[#0f7944] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100/50"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          Describe
        </button>

        {/* Photo Tab */}
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "image"
              ? "bg-white text-[#0f7944] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100/50"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
          Photo
        </button>
      </div>

      {activeTab === "quick" && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search foods..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-gray-50/30"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
            {filtered.map((food) => (
              <button
                key={food.id}
                onClick={() => categoryInjectedAdd(food)}
                className="text-left bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 rounded-2xl p-3.5 transition-all duration-200 group shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                <p className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-emerald-900">
                  {food.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">{food.servingSize}</p>
                <p className="text-xs font-bold text-[#0f7944] mt-2">{food.calories} kcal</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-4 text-sm text-gray-400 text-center py-8">
                No foods match &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "text" && <AITextSearch onAddNutritionItem={categoryInjectedAddItem} />}
      {activeTab === "image" && <AIImageSearch onAddNutritionItem={categoryInjectedAddItem} />}
    </div>
  );
}
