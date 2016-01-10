import path from 'expand-tilde';
import Promise from 'bluebird';
import _ from 'lodash';

import PouchDB from 'pouchdb';

import pouchHoodie from 'pouchdb-hoodie-api';
import pouchFind from 'pouchdb-find';

PouchDB.plugin(pouchHoodie);
PouchDB.plugin(pouchFind);

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

const indexes = [
  createDesignDoc(BY_CREATED_AT_AND_SEEN, (doc) => {
    emit(doc.meta.seen + '$' + doc.createdAt + '$' + doc._id);
  }),
  createDesignDoc(BY_CATEGORY, (doc) => {
    emit(doc.meta.task + '$' + doc.createdAt + '$' + doc._id);
  }),
  createDesignDoc(BY_CLICKED, (doc) => {
    if (doc.meta.clicked_at) {
      emit(doc.createdAt + '$' + doc._id);
    }
  })
];

export default (dbPath) => {
  const pouch = new PouchDB(path(dbPath));
  const db = pouch.hoodieApi({});
  const limit = 40;

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
      }).then((data) => {
        return data.rows.map((_) => _.doc);
      });
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
      }).then((data) => {
        return data.rows.map((_) => _.doc);
      });
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
      .then((items) => {
        return items.rows.map(_ => _.doc);
      });
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
		  pouch, db, findAllByStatus, findByCategory, findAllClicked
	  }));
};
