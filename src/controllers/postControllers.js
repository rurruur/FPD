import { catchAsync } from "../modules/error";
import Post from "../models/Post";
import User from "../models/User";

export const showUpload = (req, res) => {
	return res.render('upload', { pageTitle: '새 글 작성' });
};

export const showHome = catchAsync(async (req, res) => {
	const posts = await Post.find().sort({ createdAt: 'desc'}).populate('writer', 'nickname');
	return res.render('home', { pageTitle: 'Home', posts });
});

export const postUpload = catchAsync(async (req, res) => {
	const { title, content } = req.body;
	const { id } = req.session.user;
	const post = await Post.create({
		title,
		content,
		writer: id,
	});
	return res.redirect(`/posts/${post.id}`);
});

export const showPost = catchAsync(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id).populate('writer', 'nickname');
	console.log(post);
	return res.render('post', { pageTitle: post.title, post });
});