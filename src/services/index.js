import Registry from '@ewnd9/registry';

import ItemsService from './items-service';
import CategoriesService from './categories-service';

export default init;

function init({ db, pouch }) {
  const registry = new Registry('services');

  registry.define('itemsService', new ItemsService({ db, pouch }));
  registry.define('categoriesService', new CategoriesService({ db, pouch }));

  return registry.services;
}
