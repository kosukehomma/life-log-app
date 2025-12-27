import { z } from 'zod';

/**
 * Zod v4のtreeifyErrorを
 * フォーム表示用の fieldErrors に変換する
 */
export const extractFieldErrors = <T extends Record<string, unknown>>(
  error: z.ZodError<T>
): Partial<Record<keyof T, string[]>> => {
  const tree = z.treeifyError(error);
  const result: Partial<Record<keyof T, string[]>> = {};

  const properties = tree.properties;
  if (!properties) return result;

  for (const key in properties) {
    const node = properties[key];
    if (node?.errors?.length) {
      result[key as keyof T] = node.errors;
    }
  }

  return result;
};
