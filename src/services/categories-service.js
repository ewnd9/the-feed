import {
  CATEGORIES_STATS
} from '../db/category';

export default CategoriesService;

function CategoriesService({ Category }) {
  this.Category = Category;
}

CategoriesService.prototype.findUnseenCategories = function() {
  return this.Category
    .findByIndex(CATEGORIES_STATS, {
      include_docs: true,
      startkey: 'system-unseen:',
      endkey: 'system-unseen:\uffff'
    });
};

CategoriesService.prototype.setCategoryAsSeen = function(categoryName) {
  return this.Category
    .findOne({ _id: `system-unseen:${categoryName}` })
    .then(
      item => {
        item.unseen = false;
        return this.Category.put(item);
      },
      err => {
        if (err.reason !== 'missing') {
          return Promise.reject(err);
        } else {
          return Promise.reject(new Error(`Can't find category: "${categoryName}"`));
        }
      }
    );
};

CategoriesService.prototype.setCategoryAsUnseen = function(data) {
  return this.Category
    .update(data)
    .then(data => {
      data.unseen = true;
      return this.Category.put(data);
    });
};
