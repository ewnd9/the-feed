import test from 'ava';
import twitterTask from './twitter-links-task';

test('follow specification', t => {
  t.true(typeof twitterTask.task === 'function');
});

test('get links', async t => {
  const ignored = [
    'twitter.com'
  ];

  const items = await twitterTask.task({
    ignored,
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
