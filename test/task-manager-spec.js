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
  const { services, db: { Post, Job } } = t.context;

  const items = await dummyTask.task();
  t.ok(items.length > 0);

  await populateDb(services);

  const docs0 = await Post.db.allDocs({
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

test('postsService#findAllByStatus, postsService#updateStatus', async t => {
  const { postsService } = t.context.services;
  await populateDb(t.context.services);

  const seen = await postsService.findAllByStatus(false);
  t.ok(seen.length === 1);

  t.ok((await postsService.findAllByStatus(true)).length === 0);
  await postsService.updateStatus(seen[0]._id, true);
  t.ok((await postsService.findAllByStatus(true)).length === 1);
});

test('postsService#findAllClicked, postsService#updateClicked', async t => {
  const { postsService } = t.context.services;
  await populateDb(t.context.services);

  const seen = await postsService.findAllByStatus(false);

  t.ok((await postsService.findAllClicked()).length === 0);
  await postsService.updateClicked(seen[0]._id, true);
  t.ok((await postsService.findAllClicked()).length === 1);
});
