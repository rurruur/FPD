const loginForm = document.querySelector('.login-form');

const handleSubmitLogin = async e => {
	e.preventDefault();
	const email = loginForm.querySelector('#email').value;
	const password = loginForm.querySelector('#password').value;
	const errMsg = loginForm.querySelector('.error-msg');
	errMsg.innerText = '';
	const result = await fetch('/login', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password,
		})
	});
	if (result.status === 200)
		window.location.href = location.origin;
	else
		errMsg.innerText = '아이디 또는 비밀번호가 틀렸습니다.';
};

loginForm.addEventListener('submit', handleSubmitLogin);