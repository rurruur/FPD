export const errorHandler = (err, req, res, next) => {
	const { errorMsg } = req;
	console.log(err);
	res.render('404', { errorMsg });
};

export const catchAsync = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(err => next(err));
};