import t from 'tcomb';

export const Category = t.struct({
  task: t.String,
  updatedAt: t.String,
  name: t.maybe(t.String),
  unseen: t.Boolean,

  _id: t.String,
  _rev: t.String,
  _key: t.maybe(t.String)
});

export const Item = t.struct({
  meta: t.struct({
      task: t.String,
      seen: t.Boolean,
      clickedAt: t.maybe(t.String)
  }),

  data: t.Object,
  updatedAt: t.maybe(t.String),
  
  _id: t.String,
  _rev: t.String,
  _key: t.maybe(t.String)
});
