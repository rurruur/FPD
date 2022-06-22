export const getUserSessionFormat = (profile) => {
	const data = {
		id: profile.id,
		email: profile.email,
		nickname: profile.nickname,
		name: profile.name,
		email_auth: profile.email_auth,
		confirm: profile.confirm,
	};
	return data;
};