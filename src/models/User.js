import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	nickname: { type: String, required: true, trim: true, unique: true },
	email: { type: String, required: true, trim: true, unique: true },
	email_auth: { type: Boolean, default: false },
	social_login: { type: Boolean, default: false },
	password: { type: String },
	salt : { type: String },
	createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;