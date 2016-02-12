import test from 'ava';
import 'babel-core/register';
import redditTask from './../src/tasks/reddit-task';
import Promise from 'bluebird';

import nockHelper from './helpers/nock-helper';
const nock = nockHelper(__filename);

test.before(nock.beforeFn);
test.after(nock.afterFn);

test('follow specification', t => {
  t.true(typeof redditTask.task === 'function');
});

test('get reddit posts', async t => {
  const subreddits = ['github'];

  const items = await redditTask.task({ subreddits });
  t.is(items.length, 25);

  setTimeout(() => t.fail(), 1000);
});
