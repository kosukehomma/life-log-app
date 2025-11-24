export type Meal = {
  imageUrl: string;
  memo: string;
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
  workout: string[];
  comment: string;
  meals: Meals;
};
