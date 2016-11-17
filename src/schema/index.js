import t from 'tcomb';

export const Model = t.struct({
  _id: t.maybe(t.String),
  _rev: t.maybe(t.String),
  _key: t.maybe(t.String),

  updatedAt: t.maybe(t.String)
});

export const Category = Model.extend({
  task: t.String,
  name: t.maybe(t.String),
  unseen: t.Boolean
});

export const Item = Model.extend({
  meta: t.struct({
      task: t.String,
      seen: t.Boolean,
      clickedAt: t.maybe(t.String)
  }),

  url: t.String,
  title: t.String,

  data: t.Object
});

export const Job = Model.extend({
  name: t.String,
  task: t.String,
  interval: t.maybe(t.String),
  params: t.Object
});
