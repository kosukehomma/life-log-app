// =======================
// Meal（1件の食事）
// =======================
export type MealType = 'morning' | 'lunch' | 'dinner' | 'snack';

export type Meal = {
  id?: string;
  log_id?: string;
  type: MealType;
  image_url?: string | null;
  description?: string | null;
  calories?: number | null;
  tags?: string[] | null;
  created_at?: string;
  updated_at?: string;
};

// =======================
// 1日の中に4種類のMealが入る可能性があるので
// Partial <Record<MealType, Meal>>を採用
// =======================
export type Meals = Partial<Record<MealType, Meal>>;

// =======================
// Log（日次ログ）
// =======================
export type Log = {
  id: string;
  user_id: string;
  date: string;
  weight?: number | null;
  body_fat?: number | null;
  memo?: string | null;
  workout_tags?: string[] | null;

  meals?: Meals;
  created_at?: string;
  updated_at?: string;
};

// ======================
// logsテーブル用の型を定義
// ======================
export type LogRow = {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  body_fat: number | null;
  workout_tags: string[];
  memo: string | null;
};
