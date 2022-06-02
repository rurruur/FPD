import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	content: { type: String, required: true, trim: true },
	writer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

export default Post;