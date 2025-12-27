import { z } from 'zod';

/**
 * Life Log用の入力バリデーションスキーマ
 * 「正しいログデータとは何か」を定義する
 */
export const logSchema = z.object({
  date: z.string().min(1, '日付は必須です'),

  weight: z
    .number()
    .min(20, '体重は20kg以上で入力してください')
    .max(200, '体重は200kg以下で入力してください'),

  body_fat: z
    .number()
    .min(0, '体脂肪率は0%以上で入力してください')
    .max(60, '体脂肪率は60%以下で入力してください')
    .nullable(),

  workout_tags: z.array(z.string().min(1)).default([]),

  meals: z.record(z.string(), z.any()).default([]),

  memo: z.string().max(128, 'コメントは128文字以内で入力してください'),
});

/**
 * Zod スキーマから型を生成
 * Form / API 両方で利用可能
 */
export type LogSchemaInput = z.infer<typeof logSchema>;
