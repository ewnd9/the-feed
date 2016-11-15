import path from 'expand-tilde';
import Promise from 'bluebird';

import PouchDB from 'pouchdb';

import pouchHoodie from 'pouchdb-hoodie-api';
import pouchFind from 'pouchdb-find';

PouchDB.plugin(pouchHoodie);
PouchDB.plugin(pouchFind);

import { captureError } from '../utils/capture-error';

const createDesignDoc = (name, mapFunction) => {
  const ddoc = {
    _id: '_design/' + name,
    views: {}
  };

  ddoc.views[name] = { map: mapFunction.toString() };
  return ddoc;
};

export const BY_CREATED_AT_AND_SEEN = 'by_created_at_and_seen_0';
export const BY_CATEGORY = 'by_category_0';
export const BY_CLICKED = 'by_clicked_0';
export const CATEGORIES_STATS = 'CATEGORIES_STATS';

/*eslint-disable */
const indexes = [
  createDesignDoc(BY_CREATED_AT_AND_SEEN, `function(doc) {
    if (doc.meta) {
      emit(doc.meta.seen + '$' + doc.createdAt + '$' + doc._id);
    }
  }`),
  createDesignDoc(BY_CATEGORY, `function(doc) {
    if (doc.meta) {
      emit(doc.meta.task + '$' + doc.createdAt + '$' + doc._id);
    }
  }`),
  createDesignDoc(BY_CLICKED, `function(doc) {
    if (doc.meta && doc.meta.clicked_at) {
      emit(doc.createdAt + '$' + doc._id);
    }
  }`),
  createDesignDoc(CATEGORIES_STATS, `function(doc) {
    if (doc._id.indexOf('system-unseen') === 0) {
      emit(doc._id);
    }
  }`)
];
/*eslint-enable */

export default (dbPath, remote) => {
  const pouch = new PouchDB(path(dbPath));
  pouch.on('error', captureError);

  const db = pouch.hoodieApi({});

  if (remote) {
    pouch.replicate.to(remote, { continuous: true });
    pouch.replicate.from(remote);
  }

  return Promise
    .map(indexes, index => {
      return pouch
        .put(index)
        .then(() => {
          console.log(`${index._id} was created`);
        }, err => {
          if (err.name !== 'conflict') {
            console.log(err);
          } else {
            console.log(`${index._id} already exists`);
          }
        });
    })
    .then(() => ({
      pouch,
      db
    }));
};
