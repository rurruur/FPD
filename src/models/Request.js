import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	writer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	done: { type: Boolean, default: false }
});

const Request = mongoose.model('Request', requestSchema);

export default Request;