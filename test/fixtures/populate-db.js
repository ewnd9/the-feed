import TaskManager from '../../src/jobs/task-manager';

export default function populateDb(services) {
  const manager = new TaskManager(services);

  return services.jobsService
    .create(dummyJob)
    .then(job => manager.runJob(job));
}

export const dummyJob = { name: 'dummy-job', task: 'dummy', params: {} };
