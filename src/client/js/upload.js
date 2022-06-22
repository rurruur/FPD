const uploadForm = document.querySelector('.upload-form');

const handleSubmitJoin = async e => {
	const formData = new FormData(uploadForm);
	e.preventDefault();
	const errMsgArr = uploadForm.querySelectorAll('.error-msg');
	for (msg of errMsgArr) {
		msg.innerText = '';
	}
	const title = uploadForm.querySelector('#title').value.trim();
	const content = uploadForm.querySelector('#content').value.trim();
	if (title === '')
		errMsgArr[0].innerText = '제목이 공백입니다.';
	else if (content === '')
		errMsgArr[1].innerText = '내용이 공백입니다.';
	else {
		const result = await fetch(location.pathname, {
			method: 'POST',
			body: formData
		});
		if (result.status === 201) {
			const id = (await result.json()).id;
			window.location.href = `/posts/${id}`;
		}
	}
};

uploadForm.addEventListener('submit', handleSubmitJoin);