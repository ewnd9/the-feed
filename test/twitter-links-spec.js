import test from 'ava';
import 'babel-core/register';
import twitterTask from './../src/tasks/twitter-links-task';

test('follow specification', t => {
	t.true(typeof twitterTask.task === 'function');
});

// test('get links', async t => {
// 	const ignored = [
// 		'twitter.com'
// 	];
//
// 	const items = await twitterTask.task(ignored);
// 	console.log(items);
// 	setTimeout(() => t.fail(), 1000);
// });
