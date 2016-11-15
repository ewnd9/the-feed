import path from 'expand-tilde';
import { captureError } from '../utils/capture-error';

import PouchDB from 'pouchdb';
import init from 'pouchdb-model/dist/init';

import Item from './item';
import Category from './category';

export default (dbPath, remote) => {
  const pouch = new PouchDB(path(dbPath));
  pouch.on('error', captureError);

  if (remote) {
    pouch.replicate.to(remote, { continuous: true });
    pouch.replicate.from(remote);
  }

  return init({ Item, Category}, () => pouch);
};
