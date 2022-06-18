const profileForm = document.querySelector('.profile-form');

const handleSubmitJoin = async e => {
	e.preventDefault();
	const errMsgArr = profileForm.querySelectorAll('.error-msg');
	for (msg of errMsgArr) {
		msg.innerText = '';
	}
	const email = profileForm.querySelector('#email').value.trim();
	const name = profileForm.querySelector('#name').value.trim();
	const nickname = profileForm.querySelector('#nickname').value.trim();
	if (name === '')
		errMsgArr[1].innerText = '이름이 공백입니다.';
	else if (nickname === '')
		errMsgArr[2].innerText = '별명이 공백입니다.';
	else {
		const result = await fetch(location.pathname, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				name,
				nickname,
			})
		});
		if (result.status === 200) {
			const id = location.pathname.split('/')[2];
			window.location.href = `/users/${id}`;
		} else if (result.status === 409) {
			const error = await result.json();
			if (error.type === 'email') {
				errMsgArr[0].innerText = error.msg;
			} else if (error.type == 'nickname') {
				errMsgArr[2].innerText = error.msg;
			}
		}
	}
};

profileForm.addEventListener('submit', handleSubmitJoin);