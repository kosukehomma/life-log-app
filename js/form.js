'use strict'

const addLog = () => {
  const form = document.getElementById('log-item');
  const saveBtn = document.querySelector('.form-submit');
  const NO_IMAGE = './assets/image/no-image.png';

  saveBtn.addEventListener('click', () => {
    const log = {
      id: Date.now(),
      date: form.date.value,
      weight: form.weight.value,
      work: form.work.value,
      comment: form.comment.value,
      breakfast: NO_IMAGE,
      lunch: NO_IMAGE,
      dinner: NO_IMAGE
    };

    let pending = 0;
    let finished = () => {
      if (pending > 0) return;
      // LocalStorageから既存データを取得
      const logs = JSON.parse(localStorage.getItem('logs')) || [];
      // 新しいデータを先頭に追加
      logs.unshift(log);
      // 保存
      localStorage.setItem('logs', JSON.stringify(logs));
      // index.htmlへ遷移
      window.location.href = './index.html';
    };

    const readFile = (file, key) => {
      if (!file) return;
      pending++;
      const reader = new FileReader();
      reader.onload = e => {
        log[key] = e.target.result;
        pending--;
        finished();
      };
      reader.readAsDataURL(file);
    }

    readFile(form.breakfast.files[0], 'breakfast');
    readFile(form.lunch.files[0], 'lunch');
    readFile(form.dinner.files[0], 'dinner');

    finished();
  });

  // ---- 食事画像のプレビュー & 削除
  const photoBlocks = document.querySelectorAll('.form-table__photo');

  photoBlocks.forEach(block => {
    const input = block.querySelector('input[type="file"]');
    const preview = block.querySelector('img');
    const deleteBtn = block.querySelector('.delete-button');

    if (!input || !preview || !deleteBtn) return;

    // プレビュー
    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          preview.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        preview.src = NO_IMAGE;
      }
    });

    // 削除
    deleteBtn.addEventListener('click', () => {
      input.value = '';
      preview.src = NO_IMAGE;
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  addLog();
});
