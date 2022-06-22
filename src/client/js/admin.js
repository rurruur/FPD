const acceptBtns = document.querySelectorAll('.user__accept-btn');

const acceptUser = async e => {
	const { id } = e.target.dataset;
	await fetch(`/api/users/${id}`, {
		method: 'GET',
	});
	location.reload();
};

acceptBtns.forEach(btn => btn.addEventListener('click', acceptUser));