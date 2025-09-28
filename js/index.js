'use strict'

const getQuery = () => {
	const params = new URLSearchParams(window.location.search);
	return {
		year: params.get('year'),
		month: params.get('month')?.padStart(2, '0'),
	};
};

const cardListLineUp = () => {
	const list = document.getElementById('card-list');
	const logs = JSON.parse(localStorage.getItem('logs')) || [];
	const { year, month } = getQuery();

	list.innerHTML = '';

	// フィルタ
	const filtered = logs.filter(log => {
		if (!log.date) return false;
		const [y, m] = log.date.split('-');
		if (year && y !== year) return false;
		if (month && m !== month) return false;
		return true;
	});

	filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

	if (filtered.length === 0) {
		const emptyLi = document.createElement('li');
		emptyLi.innerHTML = '<p>まだ記録がありません</p>';
		list.appendChild(emptyLi);
	} else {
		filtered.forEach(log => {
			const li = document.createElement('li');
			li.classList.add('card-list__item');

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
	cardListLineUp();
});
