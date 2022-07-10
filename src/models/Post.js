import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	content: { type: String, required: true, trim: true },
	writer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	commentCount: { type: Number, default: 0 },
	fileUrl: { type: String },
	createdAt: { type: Date, default: Date.now },
	views: { type: Number, default: 0 }
});

const Post = mongoose.model('Post', postSchema);

export default Post;