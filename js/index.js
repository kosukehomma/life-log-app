'use strict'

window.getQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    year: params.get('year'),
    month: params.get('month')?.padStart(2, '0'),
  };
};

const setDateTitle = () => {
  const titleEl = document.getElementById('date-title');
  const params = new URLSearchParams(window.location.search);
  const year = params.get('year');
  const month = params.get('month');

  if (year && month) {
    titleEl.textContent = `${year}年${parseInt(month, 10)}月分`;
  } else {
    titleEl.textContent = '最新の7日間';
  }
};

const cardListLineUp = () => {
  const list = document.getElementById('card-list');
  const logs = JSON.parse(localStorage.getItem('logs')) || [];
  const { year, month } = getQuery();

  list.innerHTML = '';

  // 日付で降順ソート
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  // フィルタリング
  let filtered = logs;
  if (year && month) {
    filtered = logs.filter(log => {
      if (!log.date) return false;
      const [y, m] = log.date.split('-');
      return y === year && m === month;
    });
  } else {
    // クエリなし　最新7件だけ
    filtered = logs.slice(0, 7);
  }
  console.log("filtered:", filtered);
  filtered.forEach(log => { console.log("log1件:", log) })

  if (filtered.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.innerHTML = '<p>まだ記録がありません</p>';
    list.appendChild(emptyLi);
  } else {
    filtered.forEach(log => {
      const li = document.createElement('li');
      li.classList.add('card-list__item');

      const safe = (value) => value ? value : '';

      li.innerHTML = `
        <p class="item-date">${log.date}</p>
        <span class="item-weight">${log.weight}kg</span>

        <p class="item-work__title">運動内容：</p>
        <div class="item-work__detail">${log.work}</div>

        <p class="item-meal">食事：</p>
        <div class="item-meal__wrap">
          <ul class="item-meal__list">
            <li class="item-meal__photo"><img src="${log.breakfast}" alt="朝食" /></li>
            <li class="item-meal__photo"><img src="${log.lunch}" alt="昼食" /></li>
            <li class="item-meal__photo"><img src="${log.dinner}" alt="夕食" /></li>
          </ul>
        </div>

        <div class="item-comment">${log.comment}</div>
      `;

      list.appendChild(li);
    });
  }


  const addLi = document.createElement('li');
  addLi.classList.add('card-list__add');
  addLi.innerHTML = `
    <button class="card-list__add-button" onclick="location.href='./form.html'">
      <img src="./assets/image/add_circle.png" alt="add" />
    </button>
  `;
  list.appendChild(addLi);
};

document.addEventListener('DOMContentLoaded', () => {
  setDateTitle();
  cardListLineUp();
});
