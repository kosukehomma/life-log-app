'use strict'

const buildLogMenu = () => {
  const logs = JSON.parse(localStorage.getItem('logs')) || [];
  const archive = {};

  logs.forEach(log => {
    if (!log.date) return;
    const [year, month] = log.date.split('-');
    if (!archive[year]) archive[year] = {};
    archive[year][month] = true;
  });

  const nav = document.querySelector('.log-list__year');
  if (!nav) return;
  nav.innerHTML = '';

  Object.keys(archive).sort((a, b) => b - a).forEach(year => {
    const li = document.createElement('li');
    li.className = "mt-3 first:mt-0 cursor-pointer group";
    // ✅ 最初から span を作る
    const span = document.createElement('span');
    span.className = "year-toggle inline-block py-2 font-bold"
    span.textContent = `${year}年`;
    li.appendChild(span);

    const ulMonth = document.createElement('ul');
    ulMonth.classList.add('log-list__month');
    ulMonth.className = "log-list__month max-h-0 mt-2 ml-8 overflow-hidden transition-all duration-300 group-[.is-open]:max-h-[500px]";

    Object.keys(archive[year]).sort((a, b) => b - a).forEach(month => {
      const monthLi = document.createElement('li');
      monthLi.className = "mt-2"
      const link = document.createElement('a');
      link.href = `index.html?year=${year}&month=${month}`;
      link.textContent = `${month}月`;
      link.className =
            "block text-white/80 hover:text-white hover:underline transition-colors [&.is-active]:font-bold [&.is-active]:text-[#55ebbb] [&.is-active]:underline [&.is-active]:text-[18px]";
      monthLi.appendChild(link);
      ulMonth.appendChild(monthLi);
    });

    li.appendChild(ulMonth);
    nav.appendChild(li);
  });
};

const initArchiveMenu = () => {
  const yearLis = document.querySelectorAll('.log-list__year > li');

  yearLis.forEach(yearLi => {
    const months = yearLi.querySelector('.log-list__month');
    const toggle = yearLi.querySelector('.year-toggle');
    if (!months || !toggle) return;

    // localStorageに保存されている年を確認
    const activeYear = localStorage.getItem('activeYear');
    if (activeYear && toggle.textContent === activeYear) {
      yearLi.classList.add('is-open');
      months.style.maxHeight = months.scrollHeight + "px";
    }

    // --- クリックイベント ---
    toggle.addEventListener('click', () => {
      const isOpen = yearLi.classList.contains('is-open');

      // いったん全部閉じる
      yearLis.forEach(li => {
        li.classList.remove('is-open');
        const m = li.querySelector('.log-list__month');
        if (m) m.style.maxHeight = null;
      });

      // 自分だけ開く
      if (!isOpen) {
        yearLi.classList.add('is-open');
        months.style.maxHeight = months.scrollHeight + "px";

        // 開いた年を保存
        localStorage.setItem('activeYear', toggle.textContent);
      } else {
        localStorage.removeItem('activeYear');
      }
    });
  });
};

const highlightActiveLink = () => {
  const { year, month } = getQuery();
  const links = document.querySelectorAll('.log-list__month a');

  links.forEach(link => {
    const url = new URL(link.href);
    const linkYear = url.searchParams.get('year');
    const linkMonth = url.searchParams.get('month');

    if (linkYear === year && linkMonth === month) {
      link.classList.add('is-active');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  buildLogMenu();
  initArchiveMenu();
  highlightActiveLink();
});
