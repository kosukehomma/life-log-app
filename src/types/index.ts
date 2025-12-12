export type MealType = 'morning' | 'lunch' | 'dinner' | 'snack';

export type Meal = {
  id: string;
  type: MealType;
  imageUrl: string | null;
  memo: string;
  created_at?: string;
};

export type Meals = {
  morning?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  snack?: Meal;
};

export type Log = {
  id: number;
  date: string;
  weight: number;
  fat?: number | null;
  workout: string[];
  comment: string;
  meals: Partial<Record<MealType, Meal>>;
};
