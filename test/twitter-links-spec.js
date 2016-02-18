import test from 'ava';
import 'babel-core/register';
import twitterTask from './../src/tasks/twitter-links-task';

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

  console.log(items);
  setTimeout(() => t.fail(), 1000);
});
