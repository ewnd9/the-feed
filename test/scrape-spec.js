import test from 'ava';
import 'babel-core/register';
import scrapeTask from './../src/tasks/scrape-task';

test('follow specification', t => {
	t.true(typeof scrapeTask.task === 'function');
});

test('get reddit posts', async t => {
	const url = 'https://www.reddit.com/r/node/search?q=node.js&sort=new&restrict_sr=on';
	const selector = '.search-result';

	const titleSelector = '.search-title';
	const urlSelector = '.search-title@href';

	const items = await scrapeTask.task(url, selector, titleSelector, urlSelector);
	t.is(items.length, 25);

	setTimeout(() => t.fail(), 1000);
});

test('get avito posts', async t => {
	const url = 'https://www.avito.ru/moskva?bt=1&q=playstation';
	const selector = '.js-catalog-item-enum';

	const titleSelector = 'h3 a';
	const urlSelector = 'h3 a@href';
	const additional = {
		price: '.description .about'
	};

	const items = await scrapeTask.task(url, selector, titleSelector, urlSelector, additional);
	t.is(items.length, 50);

	setTimeout(() => t.fail(), 1000);
});
