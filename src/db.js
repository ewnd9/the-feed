import path from 'expand-tilde';
import Promise from 'bluebird';
import _ from 'lodash';

import PouchDB from 'pouchdb';

import pouchHoodie from 'pouchdb-hoodie-api';
import pouchFind from 'pouchdb-find';

PouchDB.plugin(pouchHoodie);
PouchDB.plugin(pouchFind);

import { captureError } from './utils/capture-error';

const createDesignDoc = (name, mapFunction) => {
  const ddoc = {
    _id: '_design/' + name,
    views: {}
  };

  ddoc.views[name] = { map: mapFunction.toString() };
  return ddoc;
};

export const BY_CREATED_AT_AND_SEEN = 'by_created_at_and_seen';
export const BY_CATEGORY = 'by_category';
export const BY_CLICKED = 'by_clicked';
export const CATEGORIES_STATS = 'CATEGORIES_STATS';

const indexes = [
  createDesignDoc(BY_CREATED_AT_AND_SEEN, (doc) => {
    if (doc.meta) {
      emit(doc.meta.seen + '$' + doc.createdAt + '$' + doc._id);
    }
  }),
  createDesignDoc(BY_CATEGORY, (doc) => {
    if (doc.meta) {
      emit(doc.meta.task + '$' + doc.createdAt + '$' + doc._id);
    }
  }),
  createDesignDoc(BY_CLICKED, (doc) => {
    if (doc.meta && doc.meta.clicked_at) {
      emit(doc.createdAt + '$' + doc._id);
    }
  }),
  createDesignDoc(CATEGORIES_STATS, (doc) => {
    if (doc._id.indexOf('system-unseen') === 0) {
      emit(doc._id);
    }
  })
];

export default (dbPath, remote) => {
  const pouch = new PouchDB(path(dbPath));
  pouch.on('error', captureError);

  const db = pouch.hoodieApi({});
  const limit = 40;

  if (remote) {
    pouch.replicate.to(remote, { continuous: true });
    pouch.replicate.from(remote);
  }

  const mapDoc = data => data.rows.map(_ => _.doc).filter(_ => !!_);

  const findAllByStatus = (seen, id, date) => {
    const skip = id && date && 1 | 0;
    const startkey = id && date && `${seen}$${date}$${id}` || `${seen}$\uffff`;

    return pouch
      .query(BY_CREATED_AT_AND_SEEN, {
        include_docs: true,
        descending: true,
        startkey: startkey,
        endkey: seen,
        limit,
        skip
      }).then(mapDoc);
  };

  const findAllClicked = (id, date) => {
    const skip = id && date && 1 | 0;
    const startkey = id && date && `${date}$${id}` || undefined;

    return pouch
      .query(BY_CLICKED, {
        include_docs: true,
        descending: true,
        startkey: startkey,
        limit,
        skip
      }).then(mapDoc);
  };

  const findByCategory = (category, id, date) => {
    const skip = id && date && 1 | 0;
    const startkey = id && date && `${category}$${date}$${id}` || `${category}$\uffff`;

    return pouch
      .query(BY_CATEGORY, {
        include_docs: true,
        descending: true,
        startkey: startkey,
        endkey: category,
        limit,
        skip
      })
      .then(mapDoc);
  };

  const Category = {
    findUnseenCategories: () => {
      return pouch
        .query(CATEGORIES_STATS, {
          include_docs: true,
          startkey: 'system-unseen:',
          endkey: 'system-unseen:\uffff'
        })
        .then(mapDoc);
    },
    setCategoryAsSeen: categoryName => {
      return db.
        find(`system-unseen:${categoryName}`)
          .then(item => {
            item.unseen = false;
            return db.add(item);
          }, err => {
            if (err.reason !== 'missing') {
              throw err;
            }
          });
    }
  };

  return Promise
    .map(indexes, (index) => {
      return pouch.put(index).then((doc) => {
        console.log(`${index._id} was created`);
      }, (err) => {
        if (err.name !== 'conflict') {
          console.log(err);
        } else {
          console.log(`${index._id} already exists`);
        }
      });
    })
    .then(() => ({
      pouch, db, findAllByStatus, findByCategory, findAllClicked,
      Category
    }));
};
