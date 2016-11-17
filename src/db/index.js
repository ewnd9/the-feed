import expandTilde from 'expand-tilde';
import { captureError } from '../utils/capture-error';

import PouchDB from 'pouchdb';
import init from 'pouchdb-model/dist/init';

import Item from './item';
import Category from './category';
import Job from './job';

export default initDb;

function initDb(dbPath) {
  return init({ Item, Category, Job }, createDb);

  function createDb(name) {
    const pouch = new PouchDB(`${expandTilde(dbPath)}-${name}`);
    pouch.on('error', captureError);

    return pouch;
  }
}
