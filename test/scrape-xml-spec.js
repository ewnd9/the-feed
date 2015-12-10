import test from 'ava';
import 'babel-core/register';
import scrapeTask from './../src/tasks/scrape-xml-task';
import fs from 'fs';
import Promise from 'bluebird';

import nockHelper from './utils/nock-helper';
const nock = nockHelper(__filename);

test.before(nock.beforeFn);
test.after(nock.afterFn);

test.only('get yahoo xml api', async t => {
	const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%22USDEUR%22,%20%22USDJPY%22,%20%22USDBGN%22,%20%22USDCZK%22,%20%22USDDKK%22,%20%22USDGBP%22,%20%22USDHUF%22,%20%22USDLTL%22,%20%22USDLVL%22,%20%22USDPLN%22,%20%22USDRON%22,%20%22USDSEK%22,%20%22USDCHF%22,%20%22USDNOK%22,%20%22USDHRK%22,%20%22USDRUB%22,%20%22USDTRY%22,%20%22USDAUD%22,%20%22USDBRL%22,%20%22USDCAD%22,%20%22USDCNY%22,%20%22USDHKD%22,%20%22USDIDR%22,%20%22USDILS%22,%20%22USDINR%22,%20%22USDKRW%22,%20%22USDMXN%22,%20%22USDMYR%22,%20%22USDNZD%22,%20%22USDPHP%22,%20%22USDSGD%22,%20%22USDTHB%22,%20%22USDZAR%22,%20%22USDISK%22%29&env=store://datatables.org/alltableswithkeys';
	const selector = 'rate';

	const titleSelector = 'Rate';
	const urlSelector = 'Name';

	const params = {
		url,
		selector,
		titleSelector,
		urlSelector
	};

	const items = await scrapeTask.task(params);
	t.is(items.length, 34);

	setTimeout(() => t.fail(), 1000);
});
