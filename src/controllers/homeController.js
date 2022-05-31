export const showHome = (req, res) => {
	return res.render('home', { pageTitle: 'Home' });
};