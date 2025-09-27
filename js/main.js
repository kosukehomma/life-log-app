'use strict'

const mealPhoto = () => {
	const photoBlocks = document.querySelectorAll('.form-table__photo');

	photoBlocks.forEach(block => {
		const input = block.querySelector('input[type="file"]');
		const preview = block.querySelector('img');
		const deleteBtn = block.querySelector('.delete-button');

		input.addEventListener('change', event => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = e => {
					preview.src = e.target.result;
				};
				reader.readAsDataURL(file);
			} else {
				preview.src = './assets/images/no-image.png';
			}
		});

		// 削除対応
		deleteBtn.addEventListener('click', () => {
      input.value = ''; // 選択解除
      preview.src = './assets/image/no-image.png'; // 初期画像に戻す
    });
	});
};

document.addEventListener('DOMContentLoaded', () => {
	mealPhoto();
});
