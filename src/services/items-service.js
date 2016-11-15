import {
  BY_CREATED_AT_AND_SEEN,
  BY_CLICKED,
  BY_CATEGORY
} from '../db/';

export default ItemsService;

function ItemsService({ db, pouch }) {
  this.db = db;
  this.pouch = pouch;
  this.limit = 40;
}

ItemsService.prototype.updateStatus = function(id, seen) {
  return this.db
    .find(id)
    .then(item => {
      item.meta.seen = seen;
      return this.db.update(item);
    });
};

ItemsService.prototype.updateClicked = function(id) {
  return this.db
    .find(id)
    .then(item => {
      item.meta.clicked_at = new Date().toISOString();
      return this.db.update(item);
    });
};

ItemsService.prototype.findAllByStatus = function(seen, id, date) {
  const skip = id && date && 1 || 0;
  const startkey = id && date && `${seen}$${date}$${id}` || `${seen}$\uffff`;

  return this.pouch
    .query(BY_CREATED_AT_AND_SEEN, {
      include_docs: true,
      descending: true,
      startkey: startkey,
      endkey: seen + '',
      limit: this.limit,
      skip
    })
    .then(data => data.rows.map(_ => _.doc));
};

ItemsService.prototype.findAllClicked = function(id, date) {
  const skip = id && date && 1 | 0;
  const startkey = id && date && `${date}$${id}` || undefined;

  return this.pouch
    .query(BY_CLICKED, {
      include_docs: true,
      descending: true,
      startkey: startkey,
      limit: this.limit,
      skip
    })
    .then(data => data.rows.map(_ => _.doc));
};

ItemsService.prototype.findByCategory = function(category, id, date) {
  const skip = id && date && 1 | 0;
  const startkey = id && date && `${category}$${date}$${id}` || `${category}$\uffff`;

  return this.pouch
    .query(BY_CATEGORY, {
      include_docs: true,
      descending: true,
      startkey: startkey,
      endkey: category,
      limit: this.limit,
      skip
    })
    .then(data => data.rows.map(_ => _.doc));
};
