import test from 'ava';
import 'babel-core/register';

import { runJob } from '../src/task-manager';
import dummyTask from '../src/tasks/dummy-task/dummy-task';

import initDb from '../src/db';

test.only('task manager', async t => {
  const { pouch, db } = await initDb(`/tmp/${Math.random()}`);

  const items = await dummyTask.task();
  t.ok(items.length > 0);
  
  const result = await runJob(db, { name: 'test-dummy', task: 'dummy' });
  t.ok(result.id === 'system-unseen:test-dummy');

  const docs = await pouch.allDocs({
    include_docs: true,
    attachments: true,
    startkey: 'design_\uffff'
  });

  t.ok(docs.rows.length === 2);
  t.ok(docs.rows[0].id === 'system-unseen:test-dummy');
  t.ok(docs.rows[1].id === 'test-dummy:1');
});
