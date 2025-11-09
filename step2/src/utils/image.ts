'use strict';

import type { ImageMeta } from '@/types';

/**
 * 画像URLを環境に応じて生成
 * @param path 画像の相対パス（例： "uploads/photo.jpg"）
 */
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  const baseUrl =
    import.meta.env.VITE_IMAGE_BASE_URL ||
    (import.meta.env.PROD
      ? 'https://example.com/assets/'
      : 'http://localhost:5173/assets/');
  return `${baseUrl}${path}`;
};

/**
 * 指定された画像が存在しない場合にプレースホルダーを返す
 */
export const getPlaceholderImage = (alt?: string): ImageMeta => {
  return {
    src: '/assets/images/no-image.png',
    alt: alt ?? 'no image',
    width: 400,
    height: 300,
  };
};

/**
 * サムネイルURLを生成（例：画像最適化用）
 * @param path 元画像パス
 * @param size 生成したいサイズ（px）
 */
export const getThumbnailUrl = (path: string, size = 300): string => {
  if (!path) return '/assets/images/no-image.png';
  const extIndex = path.lastIndexOf('.');
  if (extIndex === -1) return path;
  const name = path.substring(0, extIndex);
  const ext = path.substring(extIndex);
  return `${name}_thumb${size}${ext}`;
};
