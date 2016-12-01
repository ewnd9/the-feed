import expandTilde from 'expand-tilde';
import mkdirp from 'mkdirp';
import { captureError } from '../utils/capture-error';

import PouchDB from 'pouchdb-node';
import init from 'pouchdb-model/dist/init';

import MigratePlugin from 'pouchdb-migrate';
PouchDB.plugin(MigratePlugin);

import Post from './post';
import Job from './job';

export default initDb;

function initDb(dbPath) {
  return init({ Post, Job }, createDb);

  function createDb(name) {
    const path = `${expandTilde(dbPath)}/${name}/${name}`;
    mkdirp.sync(path);

    const pouch = new PouchDB(path);
    pouch.on('error', captureError);

    return pouch;
  }
}
