const got = require('got');
const TOKEN_ENV_VARIABLE = 'GITHUB_TOKEN';
const token = process.env[TOKEN_ENV_VARIABLE];

const processEvents = (items, filterFn, action) => {
	const mapFn = (action) => {
		return (item) => ({
			id: item.id,
			user_url: `https://github.com/${item.actor.login}`,
			title: `${item.actor.login} ${action} ${item.repo.name}`,
			url: `https://github.com/${item.repo.name}`
		});
	};

	return items.filter(filterFn).map(mapFn(action));
};

export const getStars = (items) => {
	const filterFn = (item) => item.type === 'WatchEvent' &&
														 item.payload.action === 'started';
	return processEvents(items, filterFn, 'starred');
};

export const getRepoCreations = (items) => {
	const filterFn = (item) => item.type === 'CreateEvent' &&
														 item.payload.ref_type === 'repository';
	return processEvents(items, filterFn, 'created');
};

export const getRepoMadePublics = (items) => {
	const filterFn = (item) => item.type === 'PublicEvent';
	return processEvents(items, filterFn, 'made public');
};

const task = () => {
	return got('https://api.github.com/users/ewnd9/received_events', {
		json: true,
		headers: {
			'accept': 'application/vnd.github.v3+json',
			'authorization': 'token ' + token
		}
	}).then((res) => {
		return getStars(res.body).concat(getRepoCreations(res.body))
														 .concat(getRepoMadePublics(res.body));
	});
};

export default {
	env: [TOKEN_ENV_VARIABLE],
	task
};
