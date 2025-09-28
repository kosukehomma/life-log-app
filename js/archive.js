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
		li.textContent = `${year}年`;

		const ulMonth = document.createElement('ul');
		ulMonth.classList.add('log-list__month');

		Object.keys(archive[year]).sort((a, b) => b - a).forEach(month => {
			const monthLi = document.createElement('li');
			const link = document.createElement('a');
			link.href = `index.html?year=${year}&month=${month}`;
			link.textContent = `${month}月`;
			monthLi.appendChild(link);
			ulMonth.appendChild(monthLi);
		});

		li.appendChild(ulMonth);
		nav.appendChild(li);
	});
};

document.addEventListener('DOMContentLoaded', () => {
	buildLogMenu();
});
