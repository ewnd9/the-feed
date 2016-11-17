import expandTilde from 'expand-tilde';
import mkdirp from 'mkdirp';
import { captureError } from '../utils/capture-error';

import PouchDB from 'pouchdb-node';
import init from 'pouchdb-model/dist/init';

import Item from './item';
import Category from './category';
import Job from './job';

export default initDb;

function initDb(dbPath) {
  return init({ Item, Category, Job }, createDb);

  function createDb(name) {
    const path = `${expandTilde(dbPath)}/${name}/${name}`;
    mkdirp.sync(path);

    const pouch = new PouchDB(path);
    pouch.on('error', captureError);

    return pouch;
  }
}
