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
		return res.redirect('/users/check-email');
};