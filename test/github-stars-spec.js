import test from 'ava';
import 'babel-core/register';
import githubTask from './../src/tasks/github-stars';

test('follow specification', t => {
	t.true(typeof githubTask.task === 'function');
});

test('get github stars', async t => {
	const items = await githubTask.task();

	t.true(items.length > 0);

	t.ok(items[0].id);
	t.ok(items[0].user_url);
	t.ok(items[0].title);
	t.ok(items[0].url);

	setTimeout(() => t.fail(), 10000);
});
