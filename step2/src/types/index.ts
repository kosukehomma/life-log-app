/**
 * 1件の記録（ログ）を表す型
 */
export type Log = {
  id: number;
  date: string;       // yyyy-mm-dd
  weight: string;
  work: string;
  comment: string;
  breakfast: string;  // base64文字列 or NO_IMAGEパス
  lunch: string;
  dinner: string;
};

/**
 * アーカイブ構造（年ごとの月リスト）
 * 例：{ "2025": { "01": true, "02": true } }
 */
export type Archive = Record<string, Record<string, boolean>>;

/**
 * 運動タグのカテゴリ
 */
export type WorkCategory = 'aerobic' | 'muscle' | 'boxing' | 'stretch' | 'other';
