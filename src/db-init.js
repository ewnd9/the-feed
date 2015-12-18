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

var updatedAtIndex = createDesignDoc('by_updated_at', function (doc) {
  emit(doc.updatedAt, doc);
});
var createdAtIndex = createDesignDoc('by_created_at', function (doc) {
  emit(doc.createdAt, doc);
});

export default (dbPath) => {
  var pouch = new PouchDB(path(dbPath));
  var db = pouch.hoodieApi({});

	return pouch.put(updatedAtIndex).then((doc) => {
		console.log('updatedAt index created');
	}, (err) => {
		if (err.name !== 'conflict') {
	  	console.log(err);
		} else {
      console.log('updatedAt index exists');
    }
  }).then(() => {
    return pouch.put(createdAtIndex);
  }).then((doc) => {
    console.log('createdAt index created');
	}, (err) => {
    if (err.name !== 'conflict') {
      console.log(err);
    } else {
      console.log('createdAt index exists');
    }
  }).then(() => ({
		pouch, db
	}));
};
