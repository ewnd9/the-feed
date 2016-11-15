import test from 'ava';

import createApp from '../fixtures/create-app';
import populateDb from '../fixtures/populate-db';

import Agent from 'express-router-tcomb-test';

test.beforeEach(async t => {
  t.context = await createApp();
  t.context.agent = Agent(t.context.app);
});

test.afterEach(t => {
  t.context.server.close();
});

test('GET /api/v1/categories/items/:id', async t => {
  const { services, agent } = t.context;
  await populateDb(services);

  const params = {
    id: 'unseen'
  };

  const { body } = await agent.get('/api/v1/categories/items/:id', { params });

  t.truthy(body.length === 1);
  t.truthy(body[0].meta.task === 'dummy-job');
});

test('GET /api/v1/categories', async t => {
  const { services, agent } = t.context;
  await populateDb(services);

  const { body } = await agent.get('/api/v1/categories');

  t.truthy(body.length === 1);
  t.truthy(body[0].task === 'dummy-job');
  t.truthy(body[0].unseen === true);
});

test('GET /api/v1/categories', async t => {
  const { services, agent } = t.context;
  await populateDb(services);

  const { body: body0 } = await agent.get('/api/v1/categories');
  t.truthy(body0[0].unseen === true);

  const opts1 = {
    params: {
      id: body0[0].task
    }
  };

  const { body: body1 } = await agent.put('/api/v1/categories/:id', opts1);

  const { body: body2 } = await agent.get('/api/v1/categories');
  t.truthy(body2[0].unseen === false);
});
