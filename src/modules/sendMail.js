import mailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import crypto from 'crypto';

export const sendMail = email => {
	const encrypter = crypto.createCipheriv('aes-256-cbc', process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
	const cryptoEmail =  encrypter.update(email, 'utf8', 'hex') + encrypter.final('hex');

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
		to: email,
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
}