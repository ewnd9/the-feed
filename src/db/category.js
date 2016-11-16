export const CATEGORIES_STATS = 'CATEGORIES_STATS';

const Category = {
  createId: ({ _id }) => _id,
  indexes: [
    {
      name: CATEGORIES_STATS,
      fn: `function(doc) {
        if (doc._id.indexOf('system-unseen') === 0) {
          emit(doc._id);
        }
      }`
    }
  ]
};

export default Category;
