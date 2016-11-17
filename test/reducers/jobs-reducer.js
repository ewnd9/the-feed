import test from 'ava';

import createApp from '../fixtures/create-app';
import createReduxStore from '../fixtures/create-redux-store';

import populateDb from '../fixtures/populate-db';
import * as actions from '../../src/app/actions/jobs-actions';

import Agent from 'express-router-tcomb-test';

test.beforeEach(async t => {
  t.context = await createApp();
  t.context.agent = Agent(t.context.app);
  t.context.store = createReduxStore(t.context.server.address().port);
});

test.afterEach(t => {
  t.context.server.close();
});

test('jobs reducer: fetchJobs', async t => {
  const { services, store } = t.context;
  await populateDb(services);

  await store.dispatch(actions.fetchJobs());

  const { jobs: { isFetching, jobs } } = store.getState();

  t.truthy(isFetching === false);
  t.truthy(jobs.length === 1);
});
