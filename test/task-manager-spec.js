import test from 'ava';
import 'babel-core/register';

import { TaskManager } from '../src/jobs/task-manager';
import dummyTask from '../src/jobs/tasks/dummy-task/dummy-task';

import initDb from '../src/db/';

test.beforeEach(async t => {
  t.context.db = await initDb(`/tmp/${Math.random()}`);
});

test('task manager', async t => {
  const { pouch, db } = t.context.db;

  const items = await dummyTask.task();
  t.ok(items.length > 0);

  const manager = new TaskManager(db);
  const result = await manager.runJob({ name: 'test-dummy', task: 'dummy' });
  t.ok(result.id === 'system-unseen:test-dummy');

  const docs = await pouch.allDocs({
    include_docs: true,
    startkey: 'design_\uffff'
  });

  t.ok(docs.rows.length === 2);
  t.ok(docs.rows[0].id === 'system-unseen:test-dummy');
  t.ok(docs.rows[1].id === 'test-dummy:1');
});

test('Item#findAllByStatus, Item#updateStatus', async t => {
  const { db, Item } = t.context.db;
  await populateDb(db);

  const seen = await Item.findAllByStatus(false);
  t.ok(seen.length === 1);

  t.ok((await Item.findAllByStatus(true)).length === 0);
  await Item.updateStatus(seen[0]._id, true);
  t.ok((await Item.findAllByStatus(true)).length === 1);
});

test('Item#findAllClicked, Item#updateClicked', async t => {
  const { db, Item } = t.context.db;
  await populateDb(db);

  const seen = await Item.findAllByStatus(false);

  t.ok((await Item.findAllClicked()).length === 0);
  await Item.updateClicked(seen[0]._id, true);
  t.ok((await Item.findAllClicked()).length === 1);
});

async function populateDb(db) {
  const manager = new TaskManager(db);
  await manager.runJob({ name: 'test-dummy', task: 'dummy' });
}
