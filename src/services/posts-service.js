import {
  BY_CREATED_AT_AND_SEEN,
  BY_CLICKED,
  BY_CATEGORY
} from '../db/post';

export default PostsService;

function PostsService({ Post }) {
  this.Post = Post;
  this.limit = 40;
}

PostsService.prototype.updateStatus = function(_id, seen) {
  return this.Post
    .findOne({ _id })
    .then(item => {
      item.meta.seen = seen;
      return this.Post.put(item);
    });
};

PostsService.prototype.updateClicked = function(_id) {
  return this.Post
    .findOne({ _id })
    .then(item => {
      item.meta.clickedAt = new Date().toISOString();
      return this.Post.put(item);
    });
};

PostsService.prototype.findAllByStatus = function(seen, id, date) {
  const skip = id && date && 1 || 0;
  const startkey = id && date && `${seen}$${date}$${id}` || `${seen}$\uffff`;

  return this.Post
    .findByIndex(BY_CREATED_AT_AND_SEEN, {
      descending: true,
      startkey: startkey,
      endkey: seen + '',
      limit: this.limit,
      skip
    });
};

PostsService.prototype.findAllClicked = function(id, date) {
  const skip = id && date && 1 | 0;
  const startkey = id && date && `${date}$${id}` || undefined;

  return this.Post
    .findByIndex(BY_CLICKED, {
      descending: true,
      startkey: startkey,
      limit: this.limit,
      skip
    });
};

PostsService.prototype.findByCategory = function(category, id, date) {
  const skip = id && date && 1 | 0;
  const startkey = id && date && `${category}$${date}$${id}` || `${category}$\uffff`;

  return this.Post
    .findByIndex(BY_CATEGORY, {
      descending: true,
      startkey: startkey,
      endkey: category,
      limit: this.limit,
      skip
    });
};

PostsService.prototype.put = function(data) {
  return this.Post.put(data);
};

PostsService.prototype.upsert = function(data, onNotFound) {
  let isUpdated = true;

  return this.Post
    .findOneOrInit(data, () => {
      isUpdated = false;
      return onNotFound(data).then(res => this.Post.put(res));
    })
    .then(res => {
      return [isUpdated, res];
    });
};
