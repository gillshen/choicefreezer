export function toast(text: string, type: undefined | 'success' | 'error' = undefined) {
	const toast = document.createElement('div');
	toast.classList.add('toast', 'show');

	if (type) {
		toast.classList.add(type);
		const iconHTML =
			type === 'success'
				? '<i class="fa-regular fa-circle-check"></i>'
				: '<i class="fa-solid fa-circle-exclamation"></i>';
		toast.innerHTML = `${iconHTML} ${text}`;
	} else {
		toast.innerText = text;
	}

	document.body.appendChild(toast);
	setTimeout(() => toast.classList.remove('show'), 2400);
	setTimeout(() => toast.remove(), 3000);
}
