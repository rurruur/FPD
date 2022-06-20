const profileDelBtn = document.querySelector('.profile__del-btn');

const deleteProfile = async e => {
	if (confirm("정말 탈퇴하시겠읍니까?")) {
		await fetch(location.pathname, { method: 'delete' });
		window.location.href = location.origin;
	}
};

profileDelBtn.addEventListener('click', deleteProfile);