import "../scss/styles.scss";

const dateArr = document.querySelectorAll('.createdAt');

const formatDate = date => {
	const currentTime = Date.now();
	const createdTime = date.getTime();
	if (createdTime + 86400000 <= currentTime) {
		const isoDate = date.toISOString().substring(0, 10);
		const hour = date.getHours();
		const minute = date.getMinutes();
		return `${isoDate} ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
	} else {
		// 1분 60000, 1시간 3600000 하루 86400000
		const diff = currentTime - createdTime;
		const minute = parseInt(diff / 60000);
		const hour = parseInt(diff / 3600000);
		return hour ? `${hour}시간 전` : `${minute}분 전`;
	}
};

if (dateArr) {
	for (const date of dateArr) {
		date.textContent = formatDate(new Date(date.textContent));
	}
}