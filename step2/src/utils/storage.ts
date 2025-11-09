'use strict';

import type { StorageKey } from '@/types';

/**
 * Jsonを安全に保存
 */
export const saveToStorage = <T>(key: StorageKey, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

/**
 * JSONを安全に取得
 */
export const loadFromStorage = <T>(key: StorageKey): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
};

/**
 * データ削除
 */
export const removeFromStorage = (key: StorageKey): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from storage:', error);
  }
};
