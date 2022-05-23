let loggedInUser = {
	name: "nakkim",
	nickname: "asdf",
	email: "kdkeiie8@gmail.com"
}

export const showHome = (req, res) => {
	res.render('home', { pageTitle: 'Home', loggedIn: false, loggedInUser });
};