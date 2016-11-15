import {
  CATEGORIES_STATS
} from '../db/';

export default CategoriesService;

function CategoriesService({ pouch, db }) {
  this.db = db;
  this.pouch = pouch;
}

CategoriesService.prototype.findUnseenCategories = function() {
  return this.pouch
    .query(CATEGORIES_STATS, {
      include_docs: true,
      startkey: 'system-unseen:',
      endkey: 'system-unseen:\uffff'
    })
    .then(data => data.rows.map(_ => _.doc));
};

CategoriesService.prototype.setCategoryAsSeen = function(categoryName) {
  return this.db
    .find(`system-unseen:${categoryName}`)
    .then(
      item => {
        item.unseen = false;
        return this.db.add(item);
      },
      err => {
        if (err.reason !== 'missing') {
          return Promise.reject(err);
        }
      }
    );
};
