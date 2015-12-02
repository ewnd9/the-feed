import test from 'ava';
import 'babel-core/register';
import scrapeTask from './../src/tasks/scrape-task';

test('follow specification', t => {
	t.true(typeof scrapeTask.task === 'function');
});

test('get scraped items', async t => {
	const url = 'http://mat.io';
	const selector = '.Header-list-item';

	const titleSelector = 'a';
	const urlSelector = 'a@href';

	const items = await scrapeTask.task(url, selector, titleSelector, urlSelector);

	t.is(items.length, 4);
	
	t.is(items[0].title, 'Github');
	t.is(items[0].url, 'http://github.com/matthewmueller');

	setTimeout(() => t.fail(), 1000);
});
