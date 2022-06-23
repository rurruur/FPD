const postDelBtn = document.querySelector('.post__del-btn');
const commentForm = document.getElementById('commentForm');
const textarea = commentForm.querySelector('textarea');
const commentBtn = commentForm.querySelector('button');
const commentDelBtn = document.querySelector('.comment__del-btn');

const deletePost = async () => {
	if (confirm("정말 삭제하시겠읍니까?")) {
		await fetch(location.pathname, { method: 'delete' });
		window.location.href = location.origin;
	}
};

const handleSubmit = async e => {
	e.preventDefault();
	const text = textarea.value.trim();
	const postId = location.pathname;
	const errMsg = commentForm.querySelector('.error-msg');
	errMsg.innerText = '';
	if (text === '')
		errMsg.innerText = '댓글이 공백입니다.';
	else {
		await fetch(`/api${postId}/comment`, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify({ text }),
		});
		window.location.reload();
	}
};

const deleteComment = async (event) => {
	if (confirm("정말 삭제하시겠읍니까?")) {
		const { id } = commentDelBtn.dataset;
		const postId = location.pathname;
		await fetch(`/api${postId}/comment/${id}`, {
			method: 'delete',
		});
		window.location.reload();
	}
};

if (postDelBtn)
	postDelBtn.addEventListener('click', deletePost);
if (commentForm)
	commentForm.addEventListener('submit', handleSubmit);
if (commentDelBtn)
	commentDelBtn.addEventListener('click', deleteComment);