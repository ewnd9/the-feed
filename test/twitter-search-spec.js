import test from 'ava';
import 'babel-core/register';
import twitterTask from './../src/tasks/twitter-search-task';

test('follow specification', t => {
	t.true(typeof twitterTask.task === 'function');
});

test('get search results', async t => {
	const items = await twitterTask.task({
		user: 'ewnd9',
		consumer_key: process.env['TWITTER_CONSUMER_KEY'],
	  consumer_secret: process.env['TWITTER_CONSUMER_SECRET'],
	  access_token_key: process.env['TWITTER_ACCESS_TOKEN_KEY'],
	  access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET']
	});

	t.ok(items[0].id);
	t.ok(items[0].title);
	t.ok(items[0].url);
	t.ok(items[0].data);
});
