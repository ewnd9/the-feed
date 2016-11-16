import { TaskManager } from '../../src/jobs/task-manager';

export default function populateDb(services) {
  const manager = new TaskManager(services);
  return manager.runJob({ name: 'dummy-job', task: 'dummy' });
}
