import "../scss/styles.scss";

const postDelBtn = document.querySelector('.post__del-btn');

const deletePost = async () => {
	await fetch(location.pathname, { method: "delete" });
	window.location.href = location.origin;
};

if (postDelBtn)
	postDelBtn.addEventListener('click', deletePost);