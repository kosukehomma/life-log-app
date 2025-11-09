'use strict'

import { makeWorkTags, loadFromStorage, saveToStorage } from '@/utils';
import type { Log } from './types';

// 画像をリサイズ（安全版）
const resizeImage = (file: File | null, maxWidth = 640, quality = 0.4): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!result || typeof result !== "string") {
        return reject(new Error("画像データの読み込みに失敗しました"));
      }

      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(maxWidth / img.width, 1);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error("2D contextを取得できませんでした"));

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const base64 = canvas.toDataURL(file.type || 'image/jpeg', quality);
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        reject(new Error ('画像の読み込みに失敗しました'));
      };
      img.src = result;
    };
    reader.onerror = () => reject(new Error('FileReaderエラー'));
    reader.readAsDataURL(file);
  });
};

const addLog = () => {
  const form = document.getElementById('log-item') as HTMLFormElement;
  const saveBtn = document.querySelector('.form-submit') as HTMLButtonElement;
  const NO_IMAGE = '/src/assets/image/no-image.png';
  const comment = form.querySelector('#comment') as HTMLTextAreaElement;
  if (!comment) throw new Error('コメント欄が見つかりません');
  const count = document.getElementById('comment-count') as HTMLSpanElement;
  const error = document.getElementById('comment-error') as HTMLSpanElement;

  const MAX_LENGTH = 128;

  comment.addEventListener('input', () => {
    const length = comment.value.length;
    count.textContent = `${length} / ${MAX_LENGTH}`;

    if (length > MAX_LENGTH) {
      error.textContent = '※文字数が多すぎます';
      saveBtn.disabled = true;
    } else {
      error.textContent = '';
      saveBtn.disabled = false;
    }
  });

  saveBtn.addEventListener('click', async e => {
    e.preventDefault();

    const dateInput = form.querySelector('#date') as HTMLInputElement;
    const weightInput = form.querySelector('#weight') as HTMLInputElement;
    const workInput = form.querySelector('#work-input') as HTMLInputElement;
    const breakfastInput = form.querySelector('#breakfast') as HTMLInputElement | null;
    const lunchInput = form.querySelector('#lunch') as HTMLInputElement | null;
    const dinnerInput = form.querySelector('#dinner') as HTMLInputElement | null;

    const breakfastFile = breakfastInput?.files?.[0] ?? null;
    const lunchFile = lunchInput?.files?.[0] ?? null;
    const dinnerFile = dinnerInput?.files?.[0] ?? null;

    try {
      const settledResults = await Promise.allSettled<string | null>([
        breakfastFile ? resizeImage(breakfastFile) : Promise.resolve(null),
        lunchFile ? resizeImage(lunchFile) : Promise.resolve(null),
        dinnerFile ? resizeImage(dinnerFile) : Promise.resolve(null)
      ]);

      // ✅ 成功したものだけ値を取り出す
      const [breakfastBase64, lunchBase64, dinnerBase64] = settledResults.map(r =>
        r.status === 'fulfilled' ? r.value : null
      );

      const commentValue = comment.value.trim() === '' ? 'コメント未入力' : comment.value.trim();

      const log: Log = {
        id: Date.now(),
        date: dateInput.value,
        weight: weightInput.value,
        work: workInput.value,
        comment: commentValue,
        breakfast: breakfastBase64 || NO_IMAGE,
        lunch: lunchBase64 || NO_IMAGE,
        dinner: dinnerBase64 || NO_IMAGE
      };

      const logs: Log[] = JSON.parse(localStorage.getItem('logs') ?? "[]");

      // 最大10件だけ保持（古いデータ削除)
      if (logs.length >= 10) logs.pop();
      logs.unshift(log);
      localStorage.setItem('logs', JSON.stringify(logs));

      console.log('✅ LocalStorage 保存完了！', logs);
      console.log('🟡 現在の全ログ', logs);
      alert("✅ 保存しました！");

      // ✅ ほんの少し待ってから遷移（確実に保存反映）
      await new Promise(resolve => setTimeout(resolve, 300));
      window.location.href = './index.html';

    } catch (err) {
      console.error("❌ 画像の保存中にエラーが発生:", err);
      alert("❌ 画像の保存中にエラーが発生しました。");
    }
  });

  // ---- 食事画像のプレビュー & 削除
  const photoBlocks = document.querySelectorAll('.form-table__photo');

  photoBlocks.forEach(block => {
    const input = block.querySelector('input[type="file"]') as HTMLInputElement | null;
    const preview = block.querySelector('img') as HTMLImageElement | null;
    const deleteBtn = block.querySelector('.delete-button') as HTMLButtonElement | null;

    if (!input || !preview || !deleteBtn) return;

    // プレビュー
    input.addEventListener('change', async (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      if (!target || !target.files || target.files.length === 0) return;
      const file = target.files[0];
      if (!file) return;

      // リサイズしてプレビュー
      const resizedBase64 = await resizeImage(file);
      if (resizedBase64) {
        preview.src = resizedBase64;
      }
    });

    // 削除
    deleteBtn.addEventListener('click', () => {
      input.value = '';
      preview.src = NO_IMAGE;
    });
  });

  // 運動プレビュー（タグ化）
  const workInputEl = document.getElementById('work-input') as HTMLInputElement | null;
  const workPreview = document.getElementById('work-preview') as HTMLElement | null;

  if (workInputEl && workPreview) {
    workInputEl.addEventListener('input', () => {
      const text = workInputEl.value;
      workPreview.innerHTML = makeWorkTags(text);
    });
  }
};

/**
 * ファイル選択時にプレビューを即時更新
 */
const setupImagePreview = (inputId: string) => {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input) return;

  const preview = input.nextElementSibling as HTMLImageElement | null;
  if (!preview) return;

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });
};

const editLog = () => {
  /**
   * クエリからidを取得
   */
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');
  const logs: Log[] = loadFromStorage('logs') ?? [];
  
  /**
   * フォーム要素を取得
   */
  const form = document.querySelector('form') as HTMLFormElement;
  const dateInput = document.querySelector<HTMLInputElement>('#date')!;
  const weightInput = document.querySelector<HTMLInputElement>('#weight')!;
  const workInput = document.querySelector<HTMLInputElement>('#work-input')!;
  const commentInput = document.querySelector<HTMLInputElement>('#comment')!;
  const breakfastInput = document.querySelector<HTMLInputElement>('#breakfast')!;
  const lunchInput = document.querySelector<HTMLInputElement>('#lunch')!;
  const dinnerInput = document.querySelector<HTMLInputElement>('#dinner')!;
  
  /**
   * 編集モードなら既存データを埋め込む
   */
  if (editId) {
    const targetLog = logs.find(log => String(log.id) === editId);
    if (targetLog) {
      dateInput.value = targetLog.date;
      weightInput.value = targetLog.weight;
      workInput.value = targetLog.work;
      commentInput.value = targetLog.comment;

      // --- 画像プレビューを既存データで上書き ---
      const breakfastPreview = document.querySelector<HTMLImageElement>('#breakfast + img');
      const lunchPreview = document.querySelector<HTMLImageElement>('#lunch + img');
      const dinnerPreview = document.querySelector<HTMLImageElement>('#dinner + img');

      if (targetLog.breakfast && breakfastPreview) {
        breakfastPreview.src = targetLog.breakfast;
      }
      if (targetLog.lunch && lunchPreview) {
        lunchPreview.src = targetLog.lunch;
      }
      if (targetLog.dinner && dinnerPreview) {
        dinnerPreview.src = targetLog.dinner;
      }
    }
  }
  
  setupImagePreview('breakfast');
  setupImagePreview('lunch');
  setupImagePreview('dinner');
  /**
   * 保存処理
   */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // 既存ログ取得（編集時のみ）
    const existing = editId ? logs.find(log => String(log.id) === editId) : null;

    const toBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // 各画像処理
    const breakfastFile = breakfastInput.files?.[0];
    const lunchFile = lunchInput.files?.[0];
    const dinnerFile = dinnerInput.files?.[0];
  
    const newLog: Log = {
      id: editId ? Number(editId) : Date.now(), // 新規なら現在時刻をidに
      date: dateInput.value,
      weight: weightInput.value,
      work: workInput.value,
      comment: commentInput.value || 'コメント未入力',
      breakfast: existing?.breakfast || '',
      lunch: existing?.lunch || '',
      dinner: existing?.dinner || '',
    };

    // ファイルがあるものだけ変換して上書き
    if (breakfastFile) newLog.breakfast = await toBase64(breakfastFile);
    if (lunchFile) newLog.lunch = await toBase64(lunchFile);
    if (dinnerFile) newLog.dinner = await toBase64(dinnerFile);

    // 保存
    if (editId) {
      // 既存ログ更新
      const updatedLogs = logs.map(log => String(log.id) === editId ? newLog : log);
      saveToStorage('logs', updatedLogs);
    } else {
      // 新規追加
      saveToStorage('logs', [...logs, newLog]);
    }
  
    alert(editId ? '記録を更新しました！' : '新しい記録を追加しました！');
    location.href = './index.html'
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');

  if (editId) {
    editLog();
  } else {
    addLog();
  }
});
