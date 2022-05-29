import User from "../models/User";
import crypto from 'crypto';
import fetch from 'node-fetch';
import { getUserSessionFormat } from "../modules/util";

export const showLogin = (req, res) => {
	return res.render('login', { pageTitle: '로그인'});
};

export const showJoin = (req, res) => {
	return res.render('join', { pageTitle: '회원가입'});
};

export const postJoin = async (req, res) => {
	const { email, password, password2, name, nickname } = req.body;
	// 비밀번호 일치 확인
	if (password !== password2) {
		const errorMsg = '비밀번호가 일치하지 않습니다.';
		return res.render('join', { pageTitle: '회원가입', errorMsg});
	}
	// 가입이 된 이메일인지 확인
	const foundEmail = await User.exists({ email });
	if (foundEmail !== null) {
		const errorMsg = '이미 가입된 이메일입니다.';
		return res.render('join', { pageTitle: '회원가입', errorMsg});
	}
	// 별명 존재 여부 확인
	const foundNick = await User.exists({ nickname });
	if (foundNick !== null) {
		const errorMsg = '사용중인 별명입니다.';
		return res.render('join', { pageTitle: '회원가입', errorMsg});
	}
	const salt = crypto.randomBytes(16).toString('hex');
	const hashedPass = crypto.createHmac('sha512', salt).update(password).digest('hex');
	await User.create({
		name,
		nickname,
		email,
		password: hashedPass,
		salt,
	});
	return res.render('check-email', { pageTitle: '회원가입'});
};

export const updateEmailAuth = async (req, res) => {
	const decrypter = crypto.createDecipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const email =  decrypter.update(req.params.email, 'hex', 'utf8') + decrypter.final('utf8');
	await User.findOneAndUpdate({ email }, { email_auth: true });
	return res.redirect('/login');
};

export const postLogin = async (req, res) => {
	const { email, password } = req.body;
	const foundUser = await User.findOne({ email });
	if (foundUser === null) {
		return res.redirect('/login');
	}
	const hashedPass = crypto.createHmac('sha512', foundUser.salt).update(password).digest('hex');
	if (hashedPass !== foundUser.password) {
		return res.redirect('/login');
	}
	req.session.loggedIn = true;
	req.session.user = getUserSessionFormat(foundUser);
	return res.redirect('/');
};

export const showProfile = async (req, res) => {
	const { id } = req.params;
	const foundUser = await User.findById(id);
	if (foundUser === null) {
		return res.render('404', { pageTitle: '404 Not Found', errorMsg: '사용자를 찾을 수 없습니다.' });
	}
	return res.render('profile', { pageTitle: `${foundUser.nickname}님의 프로필`, user: foundUser });
};

export const showEditProfile = (req, res) => {
	if (req.session.user.id !== req.params.id) {
		return res.redirect('/');
	}
	return res.render('edit-profile', { pageTitle: '프로필 수정' });
};

export const logout = (req, res) => {
	req.session.destroy();
	return res.redirect('/');
};