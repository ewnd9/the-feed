import Registry from '@ewnd9/registry';

import PostsService from './posts-service';
import JobsService from './jobs-service';

export default init;

function init(db) {
  const registry = new Registry('services');

  registry.define('postsService', new PostsService(db));
  registry.define('jobsService', new JobsService(db));

  return registry.services;
}
