const got = require('got');
const Promise = require('bluebird');

const get = (url, token) => {
	return got(url, {
		json: true,
		headers: {
			'accept': 'application/vnd.github.v3+json',
			'authorization': 'token ' + token
		}
	})
	.then(_ => _.body);
};

const processEvents = (items, filterFn, action) => {
	const mapFn = (action) => {
		return (item) => {
			const user = item.actor.login;;
			const userUrl = `https://github.com/${user}`;
			const repo = item.repo.name;
			const repoUrl = `https://github.com/${item.repo.name}`

			return [{
				id: item.id,
				user_url: userUrl,
				title: [
					[userUrl, user],
					action,
					[repoUrl, repo]
				],
				url: repoUrl
			}, item];
		};
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

export const getInfo = (token, [post, item]) => {
	return get(item.repo.url, token)
		.then(res => {
			post.data = post.data || {};
			post.data.desc_label = res.description;
			return post;
		});
};

const task = ({ username, token }) => {
	return get(`https://api.github.com/users/${username}/received_events`, token)
		.then(res => {
			const promises = getStars(res)
				.concat(getRepoCreations(res))
				.concat(getRepoMadePublics(res));

			return Promise.map(promises, getInfo.bind(null, token));
		});
};

export default {
	task
};
