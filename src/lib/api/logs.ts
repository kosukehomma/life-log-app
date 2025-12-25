import { supabase } from '../supabase';
import type { Log, Meal, LogRow } from '../../types';

/**
 * ログ一覧取得（meals を join）
 */
export const fetchLogs = async (): Promise<Log[]> => {
  const { data, error } = await supabase
    .from('logs')
    .select(
      `
      id,
      user_id,
      date,
      weight,
      body_fat,
      workout_tags,
      memo,
      meals (
        id,
        type,
        image_url,
        description,
        calories,
        tags
      )
    `
    )
    .order('date', { ascending: false });

  if (error) {
    console.error(error);
    throw error;
  }

  // meals を { morning, lunch... } 形式に変換
  return data.map((log) => ({
    ...log,
    meals: Object.fromEntries((log.meals ?? []).map((m: Meal) => [m.type, m])),
  }));
};

/**
 * ログ1件取得(meals を join)
 */
export const fetchLogById = async (id: string): Promise<Log> => {
  const { data, error } = await supabase
    .from('logs')
    .select(
      `
      id,
      user_id,
      date,
      weight,
      body_fat,
      workout_tags,
      memo,
      meals (
        id,
        type,
        image_url,
        description,
        calories,
        tags
      )
      `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return {
    ...data,
    meals: Object.fromEntries((data.meals ?? []).map((m: Meal) => [m.type, m])),
  };
};

/**
 * ログを新規追加(logs + meals)
 */
export const insertLog = async (log: Omit<Log, 'id'>): Promise<void> => {
  // logs 用 payload
  const logPayload = {
    user_id: log.user_id,
    date: log.date,
    weight: log.weight,
    body_fat: log.body_fat,
    workout_tags: log.workout_tags,
    memo: log.memo,
  };

  // 1. logsをinsert
  const { data: logRow, error: logError } = await supabase
    .from('logs')
    .upsert(logPayload, {
      onConflict: 'user_id,date',
    })
    .select()
    .single<LogRow>();

  if (logError) throw logError;
  if (!logRow) throw new Error('Failed to insert log');

  // 2. mealsがあればinsert
  const mealRows = Object.values(log.meals ?? {})
    .filter((meal): meal is Meal => meal !== undefined)
    .map((meal) => ({
      log_id: logRow.id,
      type: meal.type,
      image_url: meal.image_url ?? null,
      description: meal.description ?? null,
      calories: meal.calories ?? null,
      tags: meal.tags ?? null,
    }));

  if (mealRows.length === 0) return;

  const { error: mealError } = await supabase.from('meals').insert(mealRows);

  if (mealError) throw mealError;
};

export const updateLog = async (log: Log): Promise<void> => {
  // logs 更新
  const { error: logError } = await supabase
    .from('logs')
    .update({
      date: log.date,
      weight: log.weight,
      body_fat: log.body_fat,
      workout_tags: log.workout_tags,
      memo: log.memo,
    })
    .eq('id', log.id);

  if (logError) throw logError;

  // meals は一旦全削除 → 再insert(シンプルで安全)
  await supabase.from('meals').delete().eq('log_id', log.id);

  const mealRows = Object.values(log.meals ?? {})
    .filter((m): m is Meal => !!m)
    .map((m) => ({
      log_id: log.id,
      type: m.type,
      image_url: m.image_url,
      description: m.description,
      calories: m.calories ?? null,
      tags: m.tags ?? null,
    }));

  if (mealRows.length > 0) {
    const { error } = await supabase.from('meals').insert(mealRows);
    if (error) throw error;
  }
};

export const deleteLog = async (logId: string): Promise<void> => {
  // meals → logs の順で削除
  await supabase.from('meals').delete().eq('log_id', logId);
  const { error } = await supabase.from('logs').delete().eq('id', logId);
  if (error) throw error;
};
