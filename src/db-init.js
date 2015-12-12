var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-hoodie-api'));
PouchDB.plugin(require('pouchdb-find'));

var path = require('expand-tilde');

var createDesignDoc = (name, mapFunction) => {
  var ddoc = {
    _id: '_design/' + name,
    views: {}
  };

	ddoc.views[name] = { map: mapFunction.toString() };
  return ddoc;
}

var ddoc = createDesignDoc('by_updated_at', function (doc) {
  emit(doc.updatedAt, doc);
});

export default (dbPath) => {
  var pouch = new PouchDB(path(dbPath));
  var db = pouch.hoodieApi({});

	return pouch.put(ddoc).then((doc) => {
		// success
	}, (err) => {
		if (err.name !== 'conflict') {
	  	console.log(err);
		}
	}).then(() => ({
		pouch, db
	}));
};