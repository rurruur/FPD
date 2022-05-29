export const getUserSessionFormat = (profile) => {
	const data = {
		id: profile.id,
		email: profile.email,
		nickname: profile.nickname,
	};
	return data;
};