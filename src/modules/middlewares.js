import mailer from 'nodemailer';
import crypto from 'crypto';
import ejs from 'ejs';
import path from 'path';

export const findAndLocalsUser = (req, res, next) => {
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const publicOnly = (req, res, next) => {
	if (Boolean(req.session.loggedIn) === false)
		next();
	else
		return res.redirect('/');
};

export const checkLoggedIn = (req, res, next) => {
	if (req.session.loggedIn)
		next();
	else
		return res.status(403).redirect('/login');
};

export const checkEmailAuth = (req, res, next) => {
	if (req.session.user.email_auth)
		next();
	else
		return res.render('check-email');
};

export const sendAuthMail = (req, res, next) => {
	const encrypter = crypto.createCipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const cryptoEmail =  encrypter.update(req.body.email, 'utf8', 'hex') + encrypter.final('hex');

	let emailTemplate;
	ejs.renderFile(path.resolve(process.cwd()+'/src/authMail.ejs'), { authUrl: `http://localhost:4242/auth/${cryptoEmail}` }, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			emailTemplate = data;
		}
	});
	const transporter = mailer.createTransport({
		service: 'naver',
		host: 'smtp.naver.com',
		port: 465,
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS,
		},
	});
	const mailOptions = {
		from: process.env.NODEMAILER_USER,
		to: req.body.email,
		subject: '서둘러 회원가입을 완료해주세요~',
		html: emailTemplate,
	};
	
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log('Successfully Send Email.', info.response);
		}
	});
	transporter.close();
	next();
};