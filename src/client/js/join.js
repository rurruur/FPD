const joinForm = document.querySelector('.join-form');

const handleSubmitJoin = async e => {
	e.preventDefault();
	const errMsgArr = joinForm.querySelectorAll('.error-msg');
	for (msg of errMsgArr) {
		msg.innerText = '';
	}
	const email = joinForm.querySelector('#email').value.trim();
	const password = joinForm.querySelector('#password').value;
	const password2 = joinForm.querySelector('#password2').value;
	const name = joinForm.querySelector('#name').value.trim();
	const nickname = joinForm.querySelector('#nickname').value.trim();
	const passwordReg = /^[a-zA-Z0-9~!@#$%^&*()_-]{10,20}$/
	if (!passwordReg.exec(password))
		errMsgArr[1].innerText = '비밀번호는 10~20자의 영어 대소문자, 숫자, 특수기호 ~!@#$%^&*()_- 만 사용 가능합니다.';
	else if (name === '')
		errMsgArr[2].innerText = '이름이 공백입니다.';
	else if (nickname === '')
		errMsgArr[3].innerText = '별명이 공백입니다.';
	else if (password !== password2) {
		errMsgArr[1].innerText = '비밀번호가 일치하지 않습니다.';
	} else {
		const result = await fetch('/join', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
				name,
				nickname,
			})
		});
		if (result.status === 201) {
			window.location.href = location.origin;
		} else if (result.status === 409) {
			const error = await result.json();
			if (error.type === 'email') {
				errMsgArr[0].innerText = error.msg;
			} else if (error.type == 'nickname') {
				errMsgArr[3].innerText = error.msg;
			}
		}
	}
};

joinForm.addEventListener('submit', handleSubmitJoin);