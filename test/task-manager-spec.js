import test from 'ava';

import { TaskManager } from '../src/jobs/task-manager';
import initServices from '../src/services/';
import dummyTask from '../src/jobs/tasks/dummy-task/dummy-task';

import populateDb from './fixtures/populate-db';
import initDb from '../src/db/';

test.beforeEach(async t => {
  t.context.db = await initDb(`/tmp/${Math.random()}`);
  t.context.services = initServices(t.context.db);
});

test('task manager', async t => {
  const { services, db: { Item } } = t.context;

  const items = await dummyTask.task();
  t.ok(items.length > 0);

  const manager = new TaskManager(services);

  const result = await manager.runJob({ name: 'test-dummy', task: 'dummy' });
  t.ok(result._id === 'system-unseen:test-dummy');

  const docs = await Item.db.allDocs({
    include_docs: true,
    startkey: 'design_\uffff'
  });

  t.ok(docs.rows.length === 2);
  t.ok(docs.rows[0].id === 'system-unseen:test-dummy');
  t.ok(docs.rows[1].id === 'test-dummy:1');
});

test('itemsService#findAllByStatus, itemsService#updateStatus', async t => {
  const { itemsService } = t.context.services;
  await populateDb(t.context.services);

  const seen = await itemsService.findAllByStatus(false);
  t.ok(seen.length === 1);

  t.ok((await itemsService.findAllByStatus(true)).length === 0);
  await itemsService.updateStatus(seen[0]._id, true);
  t.ok((await itemsService.findAllByStatus(true)).length === 1);
});

test('Item#findAllClicked, Item#updateClicked', async t => {
  const { itemsService } = t.context.services;
  await populateDb(t.context.services);

  const seen = await itemsService.findAllByStatus(false);

  t.ok((await itemsService.findAllClicked()).length === 0);
  await itemsService.updateClicked(seen[0]._id, true);
  t.ok((await itemsService.findAllClicked()).length === 1);
});
