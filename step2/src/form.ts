'use strict'

// 画像をリサイズ（安全版）
const resizeImage = (file, maxWidth = 640, quality = 0.4) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(maxWidth / img.width, 1);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const base64 = canvas.toDataURL(file.type || 'image/jpeg', quality);

          console.log('✅ resizeImage 完了:', base64.slice(0, 50)); // デバッグ確認
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = err => {
        reject('画像の読み込みに失敗しました: ' + err.message);
      };
      img.src = e.target.result;
    };
    reader.onerror = err => reject('FileReaderエラー: ' + err.message);
    reader.readAsDataURL(file);
  });
};

const addLog = () => {
  const form = document.getElementById('log-item');
  const saveBtn = document.querySelector('.form-submit');
  const NO_IMAGE = './assets/image/no-image.png';
  const comment = form.comment;
  const count = document.getElementById('comment-count');
  const error = document.getElementById('comment-error');

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

    const breakfastInput = form.breakfast.files[0];
    const lunchInput = form.lunch.files[0];
    const dinnerInput = form.dinner.files[0];

    try {
      const settledResults = await Promise.allSettled([
        breakfastInput ? resizeImage(breakfastInput) : Promise.resolve(null),
        lunchInput ? resizeImage(lunchInput) : Promise.resolve(null),
        dinnerInput ? resizeImage(dinnerInput) : Promise.resolve(null)
      ]);

      console.log("🧩 allSettled結果:", settledResults);

      // ✅ 成功したものだけ値を取り出す
      const [breakfastBase64, lunchBase64, dinnerBase64] = settledResults.map(r => r.value || null);

      const commentValue = comment.value.trim() === '' ? 'コメント未入力' : comment.value.trim();

      const log = {
        id: Date.now(),
        date: form.date.value,
        weight: form.weight.value,
        work: form.work.value,
        comment: commentValue,
        breakfast: breakfastBase64 || NO_IMAGE,
        lunch: lunchBase64 || NO_IMAGE,
        dinner: dinnerBase64 || NO_IMAGE
      };

      console.log('保存データ確認：', log);

      const logs = JSON.parse(localStorage.getItem('logs')) || [];

      // 最大10件だけ保持（古いデータ削除)
      if (logs.length >= 10) logs.pop();
      logs.unshift(log);
      localStorage.setItem('logs', JSON.stringify(logs));

      console.log('✅ LocalStorage 保存完了！', logs);
      console.log('🟡 現在の全ログ', logs);
      alert("✅ 保存しました！（一時停止中・indexへ遷移しません）");

      // ✅ ほんの少し待ってから遷移（確実に保存反映）
      await new Promise(resolve => setTimeout(resolve, 300));
      // window.location.href = './index.html';

    } catch (err) {
      console.error("❌ 画像の保存中にエラーが発生:", err);
      alert("❌ 画像の保存中にエラーが発生しました。");
    }
  });

  // ---- 食事画像のプレビュー & 削除
  const photoBlocks = document.querySelectorAll('.form-table__photo');

  photoBlocks.forEach(block => {
    const input = block.querySelector('input[type="file"]');
    const preview = block.querySelector('img');
    const deleteBtn = block.querySelector('.delete-button');

    if (!input || !preview || !deleteBtn) return;

    // プレビュー
    input.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;

      // リサイズしてプレビュー
      const resizedBase64 = await resizeImage(file);
      preview.src = resizedBase64;
    });

    // 削除
    deleteBtn.addEventListener('click', () => {
      input.value = '';
      preview.src = NO_IMAGE;
    });
  });

  // 運動プレビュー（タグ化）
  const workInput = document.getElementById('work-input');
  const workPreview = document.getElementById('work-preview');

  if (workInput && workPreview) {
    workInput.addEventListener('input', () => {
      const text = workInput.value;
      workPreview.innerHTML = makeWorkTags(text);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  addLog();
});
