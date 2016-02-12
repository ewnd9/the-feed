import test from 'ava';
import 'babel-core/register';
import scrapeTask from './../src/tasks/scrape-task';
import fs from 'fs';
import Promise from 'bluebird';

import nockHelper from './helpers/nock-helper';
const nock = nockHelper(__filename);

test.before(nock.beforeFn);
test.after(nock.afterFn);

test('follow specification', t => {
  t.true(typeof scrapeTask.task === 'function');
});

test('get reddit posts', async t => {
  const url = 'https://www.reddit.com/r/node/search?q=node.js&sort=new&restrict_sr=on';
  const selector = '.search-result';

  const titleSelector = '.search-title';
  const urlSelector = '.search-title@href';

  const params = {
    url,
    selector,
    titleSelector,
    urlSelector
  };

  const items = await scrapeTask.task(params);
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

  const params = {
    url,
    selector,
    titleSelector,
    urlSelector,
    additional
  };

  const items = await scrapeTask.task(params);
  t.is(items.length, 50);

  setTimeout(() => t.fail(), 1000);
});
