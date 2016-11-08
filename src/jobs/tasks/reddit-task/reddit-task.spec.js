import test from 'ava';
import 'babel-core/register';

import redditTask from './reddit-task';

import nockHelper from '../_utils/nock-helper';
const nock = nockHelper(__filename);

test.before(nock.beforeFn);
test.after(nock.afterFn);

test('follow specification', t => {
  t.true(typeof redditTask.task === 'function');
});

test('get reddit posts', async t => {
  const subreddits = ['github'];

  const items = await redditTask.task({ subreddits });
  t.ok(items.length === 25);
});
