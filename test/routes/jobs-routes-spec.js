import test from 'ava';

import createApp from '../fixtures/create-app';
import populateDb, { dummyJob } from '../fixtures/populate-db';

import Agent from 'express-router-tcomb-test';

test.beforeEach(async t => {
  t.context = await createApp();
  t.context.agent = Agent(t.context.app);
  t.context.getJobs = () => t.context.agent.get('/api/v1/jobs');
});

test.afterEach(t => {
  t.context.server.close();
});

test('GET /api/v1/jobs', async t => {
  const { services, getJobs } = t.context;
  await populateDb(services);

  const { body } = await getJobs();

  t.truthy(body.jobs.length === 1);
  t.truthy(body.jobs[0].task === 'dummy');
});

test('PUT /api/v1/jobs', async t => {
  const { services, agent, getJobs } = t.context;
  await populateDb(services);

  t.truthy((await getJobs()).body.jobs.length === 1);

  const opts0 = {
    body: {
      job: dummyJob
    },
    validateResponse: false
  };

  const res0 = await agent.put('/api/v1/jobs', opts0);
  t.truthy(res0.statusCode === 409);
  t.truthy(res0.body.error.name === 'conflict');

  const opts1 = { ...opts0, validateResponse: true };
  opts1.body.job.name = opts1.body.job.name + '-1';

  const res1 = await agent.put('/api/v1/jobs', opts1);
  t.truthy(res1.statusCode === 200);

  t.truthy((await getJobs()).body.jobs.length === 2);
});

test('POST /api/v1/jobs', async t => {
  const { services, agent, getJobs } = t.context;
  await populateDb(services);

  const { body: body0 } = await getJobs();

  t.truthy(body0.jobs.length === 1);

  const job = { ...body0.jobs[0], interval: '1h' };
  const opts = {
    body: { job }
  };

  const { body: body1 } = await agent.post('/api/v1/jobs', opts);
  t.truthy(body1.job.interval === job.interval);
});

test('POST /api/v1/jobs/unseen/:id', async t => {
  const { services, agent } = t.context;
  await populateDb(services);

  const { body: body0 } = await agent.get('/api/v1/jobs');

  const job = body0.jobs[0];
  t.truthy(job.unseen === true);

  const opts1 = {
    params: {
      name: job.name
    }
  };

  await agent.post('/api/v1/jobs/unseen/:name', opts1);

  const { body: body2 } = await agent.get('/api/v1/jobs');
  t.truthy(body2.jobs[0].unseen === false);
});
