import test from 'ava';
import 'babel-core/register';

import task from './vk-search-task';

test('follow specification', t => {
  t.true(typeof task.task === 'function');
});

test('get search results', async t => {
  const query = 'The Prodigy';
  const items = await task.task(query);

  t.ok(items.length === 30);
});
