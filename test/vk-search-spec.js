import test from 'ava';
import 'babel-core/register';
import task from './../src/tasks/vk-search-task';

test('follow specification', t => {
	t.true(typeof task.task === 'function');
});

// test('get search results', async t => {
// 	const query = 'The Prodigy';
// 	const items = await task.task(query);
// 	setTimeout(() => t.fail(), 1000);
// });
