const postDelBtn = document.querySelector('.post__del-btn');
const commentForm = document.getElementById('commentForm');
const textarea = commentForm.querySelector('textarea');
const commentBtn = commentForm.querySelector('button');

const deletePost = async () => {
	await fetch(location.pathname, { method: 'delete' });
	window.location.href = location.origin;
};

const handleSubmit = async event => {
	const text = textarea.value;
	const postId = location.pathname;
	await fetch(`/api${postId}/comment`, {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body: JSON.stringify({ text }),
	});
};

if (postDelBtn)
	postDelBtn.addEventListener('click', deletePost);
if (commentForm)
	commentForm.addEventListener('submit', handleSubmit);