import User from "../models/User";
import crypto from 'crypto';
import logger from "../modules/logger";
import { catchAsync } from "../modules/error";
import { getUserSessionFormat } from "../modules/util";
import { sendMail } from "../modules/sendMail";


export const showLogin = (req, res) => {
	return res.render('login', { pageTitle: '로그인'});
};

export const showJoin = (req, res) => {
	return res.render('join', { pageTitle: '회원가입'});
};

export const postJoin = catchAsync(async (req, res) => {
	const { email, password, name, nickname } = req.body;
	// 가입이 된 이메일인지 확인
	const foundEmail = await User.findOne({ email });
	if (foundEmail !== null) {
		return res.status(409).json({ type: 'email', msg: '이미 가입된 이메일입니다.' });
	}
	// 별명 존재 여부 확인
	const foundNick = await User.findOne({ nickname });
	if (foundNick !== null) {
		return res.status(409).json({ type: 'nickname', msg: '사용중인 닉네임입니다.' });
	}
	const salt = crypto.randomBytes(16).toString('hex');
	const hashedPass = crypto.createHmac('sha512', salt).update(password).digest('hex');
	const user = await User.create({
		name,
		nickname,
		email,
		password: hashedPass,
		salt,
	});
	logger.info({
		type: 'action',
		message: 'user join',
		data: { user: user.toJSON() },
	});
	sendMail(email);
	return res.sendStatus(201);
});

export const updateEmailAuth = catchAsync(async (req, res, next) => {
	const decrypter = crypto.createDecipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const email =  decrypter.update(req.params.email, 'hex', 'utf8') + decrypter.final('utf8');
	const user = await User.findOneAndUpdate({ email }, { email_auth: true });
	if (user === null) {
		req.errorMsg = '사용자를 찾을 수 없습니다.';
		throw new Error(req.errorMsg);
	}
	logger.info({
		type: 'action',
		message: 'user email auth',
		data: { user: user.toJSON() },
	});
	if (req.session.user)
		req.session.user.email_auth = true;
	return res.redirect('/');
});

export const postLogin = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const foundUser = await User.findOne({ email });
	if (foundUser === null) {
		return res.sendStatus(404);
	}
	const hashedPass = crypto.createHmac('sha512', foundUser.salt).update(password).digest('hex');
	if (hashedPass !== foundUser.password) {
		return res.sendStatus(404);
	}
	req.session.loggedIn = true;
	req.session.user = getUserSessionFormat(foundUser);
	logger.info({
		type: 'action',
		message: 'user login',
		data: { user: foundUser.toJSON() },
	});
	return res.sendStatus(200);
});

export const showProfile = catchAsync(async (req, res) => {
	const { id } = req.params;
	const foundUser = await User.findById(id);
	if (foundUser === null) {
		req.errorMsg = '사용자를 찾을 수 없습니다.';
		throw new Error(req.errorMsg);
	}
	return res.render('profile', { pageTitle: `${foundUser.nickname}님의 프로필`, user: foundUser });
});

export const showEditProfile = (req, res) => {
	if (req.session.user.id !== req.params.id) {
		return res.redirect('/');
	}
	return res.render('edit-profile', { pageTitle: '프로필 수정' });
};

export const logout = (req, res) => {
	req.session.destroy();
	return res.redirect('/login');
};

export const sendAuthMail = (req, res) => {
	const { email } = req.session.user;
	sendMail(email);
	return res.redirect('check-email');
};

export const showCheckEmail = (req, res) => {
	return res.render('check-email', { pageTitle: '이메일 확인' });
};

export const saveUserChange = catchAsync(async (req, res) => {
	const { email, name, nickname } = req.body;
	const user = await User.findById(req.session.user.id);
	// 변경된 정보 없는 경우
	if (user.nickname === nickname && user.name === name && user.email === email) {
		return res.sendStatus(200);
	}
	const usedNickname = await User.findOne({ nickname });
	if (usedNickname !== null && user.nickname !== nickname) {
		return res.status(409).json({ type: 'nickname', msg: '사용중인 닉네임입니다.' });
	}
	const usedEmail = await User.findOne({ email });
	if (usedEmail !== null && user.email !== email) {
		return res.status(409).json({ type: 'email', msg: '이미 가입된 이메일입니다.' })
	}
	if (user.email !== email) {
		user.email_auth = false;
		user.email = email;
	}
	user.name = name;
	user.nickname = nickname;
	await user.save();
	logger.info({
		type: 'action',
		message: 'user info change',
		data: { user: user.toJSON() },
	});
	req.session.user = getUserSessionFormat(user);
	return res.sendStatus(200);
});