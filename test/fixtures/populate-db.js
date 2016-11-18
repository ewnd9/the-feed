import { createInstance } from 'tcomb-property';

import TaskManager from '../../src/jobs/task-manager';
import { Job } from '../../src/schema';

export default function populateDb(services) {
  const manager = new TaskManager(services);

  return services.jobsService
    .create(dummyJob)
    .then(job => manager.runJob(job));
}

export const dummyJob = createInstance(Job, { name: 'dummy-job', task: 'dummy-task', params: {} });
