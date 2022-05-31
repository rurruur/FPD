import logger from "./logger";

export const errorHandler = (err, req, res, next) => {
	const { errorObj } = req;
	console.log(errorObj);
	if (errorObj === undefined) {
		logger.error(err);
		res.render('404');
	} else {
		logger.error(errorObj);
		res.render('404', { errorMsg: errorObj.message });
	}
};