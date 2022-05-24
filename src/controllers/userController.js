import User from "../models/User";
import crypto from 'crypto';
import fetch from 'node-fetch';

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

export const getAuthCode = (req, res) => {
	const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`;
	res.redirect(kakaoUrl);
};

export const kakaoCallback = async (req, res) => {
	const { code } = req.query;
	const data = `grant_type=authorization_code&client_id=${process.env.KAKAO_KEY}&client_secret=${process.env.KAKAO_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&code=${code}`;
	console.log(req.query.code);
	const response = await (await fetch('https://kauth.kakao.com/oauth/token?' + data, {
		method: 'post',
		headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
	})).json();
	console.log(response);
	if ('access_token' in response) {
		const profile = (await (await fetch('https://kapi.kakao.com/v2/user/me', {
			headers: {
				Authorization: `Bearer ${response.access_token}`,
          		'Content-type': 'application/json',
			}
		})).json()).kakao_account;
		if (!profile.has_email || !profile.is_email_valid || !profile.is_email_verified) {
			// log
			return res.redirect('/login');
		}
		console.log(profile.email, profile.profile.nickname);
		const foundUser = await User.findOne({ email: profile.email });
		console.log(foundUser);
		if (foundUser === null) {
			// create user
		} else if (foundUser.social_login === false) {
			res.redirect('/login');
		} else if (foundUser.email_auth === false) {
			// 이메일 인증을 완료해주세요.
		} else {
			// 세션에 추가 후 로그인 처리
		}
	} else {
		// log
		return res.redirect('/login');
	}
};