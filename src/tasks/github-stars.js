const got = require('got');
const TOKEN_ENV_VARIABLE = 'GITHUB_TOKEN';
const token = process.env[TOKEN_ENV_VARIABLE];

export const getStars = (items) => {
	return items.filter((item) => {
		return item.type === 'WatchEvent' && item.payload.action === 'started';
	}).map((item) => ({
		id: item.id,
		user_url: `https://github.com/${item.actor.login}`,
		title: `${item.actor.login} starred ${item.repo.name}`,
		url: `https://github.com/${item.repo.name}`
	}));
};

export const getRepoCreations = (items) => {
	return items.filter((item) => {
		return item.type === 'CreateEvent' && item.payload.ref_type === 'repository';
	}).map((item) => ({
		id: item.id,
		user_url: `https://github.com/${item.actor.login}`,
		title: `${item.actor.login} created ${item.repo.name}`,
		url: `https://github.com/${item.repo.name}`
	}));
};

const task = () => {
	return got('https://api.github.com/users/ewnd9/received_events', {
		json: true,
		headers: {
			'accept': 'application/vnd.github.v3+json',
			'authorization': 'token ' + token
		}
	}).then((res) => {
		return getStars(res.body).concat(getRepoCreations(res.body));
	});
};

export default {
	env: [TOKEN_ENV_VARIABLE],
	task
};
