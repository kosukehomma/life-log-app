/**
 * 保存対象のキーを制限（誤字防止）
 */
export type StorageKey = 'logs' | 'settings';

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

/**
 * 画像メタ情報
 */
export type ImageMeta = {
  src: string;  // 実際の画像URL
  alt?: string; // 代替テキスト
  width?: number; // 幅（任意）
  height?: number;  // 高さ（任意）
  placeholder?: string; // プレースホルダー画像のURL
};
