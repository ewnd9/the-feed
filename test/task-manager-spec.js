import test from 'ava';
import 'babel-core/register';

import { runTask } from '../src/task-manager';
import dummyTask from '../src/tasks/dummy-task';

import initDb from '../src/db-init';

test.only('task manager', async t => {
  const { pouch, db } = await initDb(`/tmp/${Math.random()}`);
  const items = await dummyTask.task();
  const result = await runTask(pouch, db, { name: 'test-dummy', task: 'dummy' });

  const docs = await pouch.allDocs({
    include_docs: true,
    attachments: true,
    startkey: 'design_\uffff'
  });

  t.ok(docs.rows.length === 2);
  t.ok(docs.rows[0].id === 'system-unseen:test-dummy');
  t.ok(docs.rows[1].id === 'test-dummy:1');
});
