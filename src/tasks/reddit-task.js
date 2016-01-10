import got from 'got';

const task = ({ subreddits }) => {
  return got(`https://api.reddit.com/r/${subreddits.join('+')}/new`, {
		json: true
	}).then((res) => {
    return res.body.data.children.map(({ data }) => {
      return {
        title: `/r/${data.subreddit}: ${data.title}`,
        url: data.url,
        id: data.url
      };
    });
	});
};

export default { task };
