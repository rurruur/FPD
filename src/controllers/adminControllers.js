import User from "../models/User";
import { catchAsync } from "../modules/error"

export const showAdminPage = catchAsync(async (req, res) => {
	const users = await User.find();
	return res.render('admin', { pageTitle: '관리자 화면', users });
});

export const acceptRegister = catchAsync(async (req, res) => {
	const { id } = req.params;
	await User.findOneAndUpdate({ _id: id }, { confirm: true });
	return res.sendStatus(200);
});