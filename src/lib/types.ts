export interface Food {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionItem {
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionResponse {
  items: NutritionItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  description: string;
}

export type MealCategory = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface LogEntry {
  id: number;
  food_id: string;
  food_name: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  logged_at: string;
  date: string;
  meal_category: MealCategory;
}
