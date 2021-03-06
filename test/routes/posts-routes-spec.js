import test from 'ava';

import createApp from '../fixtures/create-app';
import populateDb from '../fixtures/populate-db';

import Agent from 'express-router-tcomb-test';

test.beforeEach(async t => {
  t.context = await createApp();
  t.context.agent = Agent(t.context.app);
  t.context.getClicked = () => {
    const opts = {
      params: {
        id: 'clicked'
      }
    };

    return t.context.agent.get('/api/v1/posts/job/:id', opts);
  };
  t.context.getUnseen = () => {
    const opts = {
      params: {
        id: 'unseen'
      }
    };

    return t.context.agent.get('/api/v1/posts/job/:id', opts);
  };
});

test.afterEach(t => {
  t.context.server.close();
});

test('PUT /api/v1/posts/:id/seen', async t => {
  const { services, agent, getUnseen } = t.context;
  await populateDb(services);

  const { body: body0 } = await getUnseen();

  t.truthy(body0.posts.length === 1);
  t.truthy(body0.posts[0].meta.jobName === 'dummy-job');

  const opts1 = {
    params: {
      id: body0.posts[0]._id
    }
  };

  const { body: body1 } = await agent.put('/api/v1/posts/:id/seen', opts1);
  t.truthy(body1.post._id === opts1.params.id);

  const { body: body2 } = await getUnseen();
  t.truthy(body2.posts.length === 0);
});

test('PUT /api/v1/posts/:id/clicked', async t => {
  const { services, agent, getUnseen, getClicked } = t.context;
  await populateDb(services);

  const { body: body0 } = await getClicked();
  t.truthy(body0.posts.length === 0);

  const { body: body1 } = await getUnseen();

  const opts2 = {
    params: {
      id: body1.posts[0]._id
    }
  };

  const { body: body2 } = await agent.put('/api/v1/posts/:id/clicked', opts2);
  t.truthy(body2.post._id === opts2.params.id);

  const { body: body3 } = await getClicked();
  t.truthy(body3.posts.length === 1);
  t.truthy(body3.posts[0].meta.jobName === 'dummy-job');
});
