import test from 'ava';

import initServices from '../src/services/';
import dummyTask from '../src/jobs/tasks/dummy-task/dummy-task';

import populateDb from './fixtures/populate-db';
import initDb from '../src/db/';

test.beforeEach(async t => {
  t.context.db = await initDb(`/tmp/${Math.random()}`);
  t.context.services = initServices(t.context.db);
});

test('task manager', async t => {
  const { services, db: { Item, Job } } = t.context;

  const items = await dummyTask.task();
  t.ok(items.length > 0);

  await populateDb(services);

  const docs0 = await Item.db.allDocs({
    include_docs: true,
    startkey: 'design_\uffff'
  });

  t.ok(docs0.rows.length === 1);
  t.ok(docs0.rows[0].id === 'dummy-job:1');

  const docs1 = await Job.db.allDocs({
    include_docs: true,
    startkey: 'design_\uffff'
  });

  t.ok(docs1.rows.length === 1);
  t.ok(docs1.rows[0].id === 'dummy-job');
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
