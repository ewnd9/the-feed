import {
  BY_CREATED_AT_AND_SEEN,
  BY_CLICKED,
  BY_CATEGORY
} from '../db/item';

export default ItemsService;

function ItemsService({ Item }) {
  this.Item = Item;
  this.limit = 40;
}

ItemsService.prototype.updateStatus = function(_id, seen) {
  return this.Item
    .findOne({ _id })
    .then(item => {
      item.meta.seen = seen;
      return this.Item.put(item);
    });
};

ItemsService.prototype.updateClicked = function(_id) {
  return this.Item
    .findOne({ _id })
    .then(item => {
      item.meta.clickedAt = new Date().toISOString();
      return this.Item.put(item);
    });
};

ItemsService.prototype.findAllByStatus = function(seen, id, date) {
  const skip = id && date && 1 || 0;
  const startkey = id && date && `${seen}$${date}$${id}` || `${seen}$\uffff`;

  return this.Item
    .findByIndex(BY_CREATED_AT_AND_SEEN, {
      descending: true,
      startkey: startkey,
      endkey: seen + '',
      limit: this.limit,
      skip
    });
};

ItemsService.prototype.findAllClicked = function(id, date) {
  const skip = id && date && 1 | 0;
  const startkey = id && date && `${date}$${id}` || undefined;

  return this.Item
    .findByIndex(BY_CLICKED, {
      descending: true,
      startkey: startkey,
      limit: this.limit,
      skip
    });
};

ItemsService.prototype.findByCategory = function(category, id, date) {
  const skip = id && date && 1 | 0;
  const startkey = id && date && `${category}$${date}$${id}` || `${category}$\uffff`;

  return this.Item
    .findByIndex(BY_CATEGORY, {
      descending: true,
      startkey: startkey,
      endkey: category,
      limit: this.limit,
      skip
    });
};

ItemsService.prototype.put = function(data) {
  return this.Item.put(data);
};

ItemsService.prototype.upsert = function(data, onNotFound) {
  let isUpdated = true;

  return this.Item
    .findOneOrInit(data, () => {
      isUpdated = false;
      return onNotFound(data).then(res => this.Item.put(res));
    })
    .then(res => {
      return [isUpdated, res];
    });
};
