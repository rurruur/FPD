import Request from "../models/Request";
import { catchAsync } from "../modules/error";

export const showContactList = catchAsync(async (req, res) => {
	const requests = await Request.find().sort({ createdAt: 'desc'});
	return res.render('request-home', { pageTitle: '건의사항', requests });
});

export const uploadRequest = catchAsync(async (req, res) => {
	const { title } = req.body;
	const { id } = req.session.user;

	await Request.create({ title, writer: id });
	return res.redirect('request');
});