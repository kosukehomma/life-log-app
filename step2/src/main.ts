'use strict'

import './style.css';
import { getQuery, makeWorkTags } from "./utils";

interface LogData {
  date: string;
  weight: number;
  work: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  comment: string;
}

const cardListLineUp = (): void => {
  const list = document.getElementById('card-list');
  if (!list) return;

  const logs: LogData[] = JSON.parse(localStorage.getItem('logs') ?? '[]');
  const { year, month } = getQuery();

  list.innerHTML = '';

  // --- フィルタ ---
  let filtered = logs.filter(log => log.date);
  if (year || month) {
    filtered = filtered.filter(log => {
      const [y, m] = log.date.split('-');
      return (!year || y === year) && (!month || m === month);
    });
  }

  // --- 日付降順ソート ---
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayLogs = !year && !month ? filtered.slice(0, 7) : filtered;

  // 見出しh2追加
  const main = document.querySelector('main .container') as HTMLElement | null;
  if (!main) return;

  const oldHeading = document.querySelector('.log-heading');
  if (oldHeading) oldHeading.remove();

  const heading = document.createElement('h2');
  heading.className = "log-heading text-[28px] mb-4"
  heading.textContent = year && month
    ? `${year}年${Number(month)}月の記録`
    : '最新の7日間';
  main.insertBefore(heading, main.firstChild);

  if (displayLogs.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.innerHTML = '<p>まだ記録がありません</p>';
    list.appendChild(emptyLi);
  } else {
    displayLogs.forEach(log => {
      const li = document.createElement('li');
      li.className = "card-list__item max-w-[calc(25%-12px)] min-w-[193px] border-2 border-primary rounded-[20px] p-[14px_8px] bg-[#f4f7fa] flex flex-col relative min-h-[482px] h-full"
  
      li.innerHTML = `
        <p class="font-bold text-[16px] mb-[10px]">${log.date}</p>
        <span class="font-bold text-[28px] absolute top-[12px] right-[16px]">${log.weight}kg</span>
  
        <p class="font-bold text-[12px] mb-[2px]">運動内容：</p>
        <div class="text-[12px] leading-[1.2] min-h-[100px] mb-[8px]">${makeWorkTags(log.work)}</div>
  
        <p class="font-bold text-[12px] mb-[2px]">食事：</p>
        <div class="max-w-full w-full my-[2px]">
          <ul class="flex gap-[8px] overflow-x-auto scroll-snap-x scroll-snap-mandatory p-0 mx-[12px]">
            <li class="flex-none scroll-snap-start max-w-[185px] relative before:content-['朝食'] before:block before:bg-primary before:text-white before:px-[6px] before:py-[4px] before:text-[12px] before:absolute before:top-0 before:left-0 before:rounded-tl-[8px]">
              <img src="${log.breakfast}" alt="朝食" class="w-full h-auto aspect-[14/9] object-cover object-center rounded-[8px]" />
            </li>
            <li class="flex-none scroll-snap-start max-w-[185px] relative before:content-['朝食'] before:block before:bg-primary before:text-white before:px-[6px] before:py-[4px] before:text-[12px] before:absolute before:top-0 before:left-0 before:rounded-tl-[8px]">
              <img src="${log.lunch}" alt="昼食" class="w-full h-auto aspect-[14/9] object-cover object-center rounded-[8px]" />
            </li>
            <li class="flex-none scroll-snap-start max-w-[185px] relative before:content-['朝食'] before:block before:bg-primary before:text-white before:px-[6px] before:py-[4px] before:text-[12px] before:absolute before:top-0 before:left-0 before:rounded-tl-[8px]">
              <img src="${log.dinner}" alt="夕食" class="w-full h-auto aspect-[14/9] object-cover object-center rounded-[8px]" />
            </li>
          </ul>
        </div>
  
        <div class="item-comment text-[12px] leading-[1.3] mt-[8px] [&.is-empty]:text-gray-500 [&.is-empty]:italic ${log.comment === 'コメント未入力' ? 'is-empty' : ''}">
          ${log.comment}
        </div>
      `;
  
      list.appendChild(li);
    });
  }

  const addLi = document.createElement('li');
  addLi.className = "card-list__add max-w-[calc(25%-12px)] w-full min-w-[193px] border-4 border-dashed border-primary rounded-[20px] p-[20px_16px] flex flex-col justify-center items-center min-h-[437px] h-full"
  addLi.innerHTML = `
    <button class="card-list__add-button bg-transparent outline-none rounded-full border-none cursor-pointer active:mt-[3px]" onclick="location.href='./form.html'">
      <img src="/add_circle.png" alt="add" />
    </button>
  `;
  list.appendChild(addLi);
};

/*
* DOM Ready
*/
document.addEventListener('DOMContentLoaded', () => {
  cardListLineUp();
});
