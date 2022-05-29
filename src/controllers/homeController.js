let loggedInUser = {
	name: "nakkim",
	nickname: "asdf",
	email: "kdkeiie8@gmail.com"
}

export const showHome = (req, res) => {
	return res.render('home', { pageTitle: 'Home' });
};