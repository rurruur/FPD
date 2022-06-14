import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	text: { type: String, required: true },
	writer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
	createdAt: { type: Date, required: true, default: Date.now },
});

// 댓글 앞뒤의 화이트 스페이스 제거
commentSchema.pre("save", async function () {
	this.text = this.text.replace(/^\s+|\s+$/g, '');
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;