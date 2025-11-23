export type Meal = {
  img: string;
  label: '朝食' | '昼食' | '夕食';
  name?: string;
  note?: string;
};

export type Log = {
  id: number;
  date: string;
  weight: number;
  work: string;
  comment: string;
  meals: Meal[];
};
