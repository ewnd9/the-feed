import path from 'expand-tilde';
import Promise from 'bluebird';
import _ from 'lodash';

import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-hoodie-api'));
PouchDB.plugin(require('pouchdb-find'));

const createDesignDoc = (name, mapFunction) => {
  const ddoc = {
    _id: '_design/' + name,
    views: {}
  };

	ddoc.views[name] = { map: mapFunction.toString() };
  return ddoc;
};

export const BY_CREATED_AT = 'by_created_at';
export const BY_CATEGORY = 'by_category';

const indexes = [
  createDesignDoc(BY_CREATED_AT, (doc) => {
    emit([doc.createdAt, doc._id]);
  }),
  createDesignDoc(BY_CATEGORY, (doc) => {
    emit(doc.meta.task + '$' + doc.createdAt + '$' + doc._id);
  })
];

export default (dbPath) => {
  const pouch = new PouchDB(path(dbPath));
  const db = pouch.hoodieApi({});

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
		  pouch, db
	  }));
};
