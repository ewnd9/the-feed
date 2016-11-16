import test from 'ava';

import redditTask from './reddit-task';
import nockHook from 'nock-hook/ava';

test.beforeEach(t => {
  t.context.closeNock = nockHook(t, __filename, { dirname: __dirname + '/fixtures' });
});

test.afterEach(t => {
  t.context.closeNock();
});

test('follow specification', t => {
  t.true(typeof redditTask.task === 'function');
});

test('get reddit posts', async t => {
  const subreddits = ['github'];

  const items = await redditTask.task({ subreddits });
  t.ok(items.length === 25);
});
