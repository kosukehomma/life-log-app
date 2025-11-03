'use strict'

import { getQuery } from './utils';

interface LogData {
  date: string;
  weight: number;
  work: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  comment: string;
}

interface Archive {
  [year: string]: {
    [month: string]: boolean;
  };
}

const buildLogMenu = (): void => {
  const logs: LogData[] = JSON.parse(localStorage.getItem('logs') ?? '[]');
  const archive: Archive = {};

  logs.forEach((log: LogData) => {
    if (!log.date) return;
    const [year, month] = log.date.split('-');
    if (!archive[year]) archive[year] = {};
    archive[year][month] = true;
  });

  const nav = document.querySelector('.log-list__year') as HTMLElement | null;
  if (!nav) return;
  nav.innerHTML = '';

  Object.keys(archive).sort((a, b) => Number(b) - Number(a)).forEach(year => {
    const li = document.createElement('li');
    li.className = "mt-3 first:mt-0 cursor-pointer group";
    // 最初から span を作る
    const span = document.createElement('span');
    span.className = "year-toggle inline-block py-2 font-bold"
    span.textContent = `${year}年`;
    li.appendChild(span);

    const ulMonth = document.createElement('ul');
    ulMonth.className = "log-list__month max-h-0 mt-2 ml-8 overflow-hidden transition-all duration-300 group-[.is-open]:max-h-[500px]";

    Object.keys(archive[year]).sort((a, b) => Number(b) - Number(a)).forEach(month => {
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

const initArchiveMenu = (): void => {
  const yearLis = document.querySelectorAll('.log-list__year > li');

  yearLis.forEach(yearLi => {
    const months = yearLi.querySelector('.log-list__month') as HTMLElement | null;
    const toggle = yearLi.querySelector('.year-toggle') as HTMLElement | null;
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
        const m = li.querySelector('.log-list__month') as HTMLElement | null;
        if (m) m.style.maxHeight = "";
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
    const a = link as HTMLAnchorElement;
    const url = new URL(a.href);
    const linkYear = url.searchParams.get('year');
    const linkMonth = url.searchParams.get('month');

    if (linkYear === year && linkMonth === month) {
      a.classList.add('is-active');
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  buildLogMenu();
  initArchiveMenu();
  highlightActiveLink();
});
