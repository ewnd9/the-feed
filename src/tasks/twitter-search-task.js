import twitter from './../utils/twitter';
import _ from 'lodash';

const task = (user) => {
	const params = {
		q: user,
		count: 100,
		result_type: 'recent'
	};
	
	return twitter.getAsync('search/tweets', params).then((result) => {
		return result.statuses.filter((status) => {
			return status.user.screen_name !== user &&
						 (!status.quoted_status || status.quoted_status.user.screen_name !== user) &&
						 !_.any(status.entities.user_mentions, (mention) => mention.screen_name === user);
		});
	}).then((result) => {
		return result.map((item) => ({
			id: item.id_str,
			title: `@${item.user.screen_name}: ${item.text}`,
			url: `https://twitter.com/${item.user.screen_name}/status/${item.id_str}`,
			url_url: `https://twitter.com/${item.user.screen_name}`
		}));
	});
};

export default {
	task
};
