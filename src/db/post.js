export const BY_CREATED_AT_AND_SEEN = 'by_created_at_and_seen_0';
export const BY_CATEGORY = 'by_category_0';
export const BY_CLICKED = 'by_clicked_0';

const Post = {
  createId: ({ _id }) => _id,
  indexes: [
    {
      name: BY_CREATED_AT_AND_SEEN,
      fn: `function(doc) {
        if (doc.meta) {
          emit(doc.meta.seen + '$' + doc.createdAt + '$' + doc._id);
        }
      }`
    },
    {
      name: BY_CATEGORY,
      fn: `function(doc) {
        if (doc.meta) {
          emit(doc.meta.task + '$' + doc.createdAt + '$' + doc._id);
        }
      }`
    },
    {
      name: BY_CLICKED,
      fn: `function(doc) {
        if (doc.meta && doc.meta.clickedAt) {
          emit(doc.createdAt + '$' + doc._id);
        }
      }`
    }
  ]
};

export default Post;
