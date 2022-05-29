import mailer from 'nodemailer';
import crypto from 'crypto';
import ejs from 'ejs';
import path from 'path';

export const findAndLocalsUser = (req, res, next) => {
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const sendAuthMail = (req, res, next) => {
	const encrypter = crypto.createCipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const cryptoEmail =  encrypter.update(req.body.email, 'utf8', 'hex') + encrypter.final('hex');

	let emailTemplate;
	ejs.renderFile(path.resolve(process.cwd()+'/src/authMail.ejs'), { authUrl: `http://localhost:4242/users/auth/${cryptoEmail}` }, function (err, data) {
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

export const checkMail = async (req, res) => {
	const decrypter = crypto.createDecipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const email =  decrypter.update(req.params.mail, 'hex', 'utf8') + decrypter.final('utf8');
	// email로 유저 찾아서 auth = y 업데이트
	User.findOneAndUpdate({ email }, { email_auth: 'y'}, null, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			console.log(doc);
		}
	});
	res.redirect('/login');
};