import test from 'ava';
import 'babel-core/register';

import task from './vk-group-wall-task';

test('follow specification', t => {
  t.true(typeof task.task === 'function');
});

test('get search results', async t => {
  const owner = '-1';
  const items = await task.task(owner);
  
  t.ok(items.length === 20);
});
