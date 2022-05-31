import logger from "./logger";

export const errorHandler = (err, req, res, next) => {
	const { errorMsg } = req;
	logger.error(err);
	res.render('404', { errorMsg });
};

export const catchAsync = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(err => next(err));
};