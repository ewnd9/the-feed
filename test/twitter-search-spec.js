import test from 'ava';
import 'babel-core/register';
import twitterTask from './../src/tasks/twitter-search-task';

test('follow specification', t => {
	t.true(typeof twitterTask.task === 'function');
});

// test('get search results', async t => {
// 	const items = await twitterTask.task('ewnd9');
// 	setTimeout(() => t.fail(), 1000);
// });
