import User from "../models/User";
import crypto from 'crypto';
import fetch from 'node-fetch';
import { getUserSessionFormat } from "../modules/util";

export const showLogin = (req, res) => {
	return res.render('login', { pageTitle: '로그인', loggedIn: false });
};

export const showJoin = (req, res) => {
	return res.render('join', { pageTitle: '회원가입', loggedIn: false });
};

export const postJoin = async (req, res) => {
	const { email, password, password2, name, nickname } = req.body;
	// 비밀번호 일치 확인
	if (password !== password2) {
		const errorMsg = '비밀번호가 일치하지 않습니다.';
		return res.render('join', { pageTitle: '회원가입', errorMsg, loggedIn: false });
	}
	// 가입이 된 이메일인지 확인
	const foundEmail = await User.exists({ email });
	if (foundEmail !== null) {
		const errorMsg = '이미 가입된 이메일입니다.';
		return res.render('join', { pageTitle: '회원가입', errorMsg, loggedIn: false });
	}
	// 별명 존재 여부 확인
	const foundNick = await User.exists({ nickname });
	if (foundNick !== null) {
		const errorMsg = '사용중인 별명입니다.';
		return res.render('join', { pageTitle: '회원가입', errorMsg, loggedIn: false });
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
	res.render('checkEmail', { pageTitle: '회원가입', loggedIn: false });
};

export const authMail = async (req, res) => {
	const decrypter = crypto.createDecipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const email =  decrypter.update(req.params.email, 'hex', 'utf8') + decrypter.final('utf8');
	await User.findOneAndUpdate({ email }, { email_auth: true });
	res.redirect('/login');
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