import { catchAsync } from "../modules/error";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const showUpload = (req, res) => {
	return res.render('upload', { pageTitle: '새 글 작성' });
};

export const showHome = catchAsync(async (req, res) => {
	const posts = await Post.find().sort({ createdAt: 'desc'}).populate('writer', 'nickname');
	return res.render('home', { pageTitle: 'Home', posts });
});

export const postUpload = catchAsync(async (req, res) => {
	const { title, content } = req.body;
	const { file } = req;
	const { id } = req.session.user;
	const post = await Post.create({
		title,
		content,
		writer: id,
		fileUrl: process.env.MODE === 'production' ? file.location : `/${file.path}`,
	});
	return res.status(201).json({ id: post.id });
});

export const showPost = catchAsync(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id).populate('writer', 'nickname');
	const comments = await Comment.find({ post: id }).populate('writer');
	if (req.cookies[id] == undefined | req.cookies[id] != req.session.user.id) {
		res.cookie(id, req.session.user.id, { maxAge: 720000 });
		post.views += 1;
		await post.save();
	}
	return res.render('post', { pageTitle: post.title, post, comments });
});

export const deletePost = catchAsync(async (req, res) => {
	const { id } = req.params;
	await Comment.find({ post: id }).remove();
	await Post.deleteOne({ _id: id });
	return res.sendStatus(200);
	// return res.redirect(303, '/');
});

export const registerComment = catchAsync(async (req, res) => {
	const {
		session: { user: { id: userId } },
		params: { id: postId },
		body: { text },
	} = req;
	const comment = await Comment.create({
		text,
		writer: userId,
		post: postId,
	});
	return res.sendStatus(201);
});

export const deleteComment = catchAsync(async (req, res) => {
	const { commentId } = req.params;
	await Comment.findByIdAndDelete(commentId);
	return res.sendStatus(200);
});