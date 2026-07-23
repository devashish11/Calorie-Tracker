import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "calorie_tracker.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS log_entries (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    food_id        TEXT    NOT NULL,
    food_name      TEXT    NOT NULL,
    serving_size   TEXT    NOT NULL,
    calories       REAL    NOT NULL,
    protein        REAL    NOT NULL,
    carbs          REAL    NOT NULL,
    fat            REAL    NOT NULL,
    servings       REAL    NOT NULL DEFAULT 1,
    logged_at      TEXT    NOT NULL,
    date           TEXT    NOT NULL,
    meal_category  TEXT    NOT NULL DEFAULT 'Breakfast'
  )
`);

try {
  db.exec("ALTER TABLE log_entries ADD COLUMN meal_category TEXT NOT NULL DEFAULT 'Breakfast'");
} catch {
  // column already exists — safe to ignore
}

export default db;
