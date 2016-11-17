import Registry from '@ewnd9/registry';

import ItemsService from './items-service';
import JobsService from './jobs-service';

export default init;

function init(db) {
  const registry = new Registry('services');

  registry.define('itemsService', new ItemsService(db));
  registry.define('jobsService', new JobsService(db));

  return registry.services;
}
