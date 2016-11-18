import t from 'tcomb';
import { property } from 'tcomb-property';

import parseInterval from '../utils/parse-interval';

export const Model = t.struct({
  _id: t.maybe(t.String),
  _rev: t.maybe(t.String),
  _key: t.maybe(t.String),

  updatedAt: t.maybe(t.String)
});

export const Post = Model.extend({
  meta: t.struct({
    jobId: t.String,
    jobName: t.String,
    task: t.String,
    seen: t.Boolean,
    clickedAt: t.maybe(t.String)
  }),

  url: t.String,
  title: t.String,

  data: t.Object
});

export const Interval = t.refinement(t.String, x => parseInterval(x) > 0);
Interval.getValidationErrorMessage = interval => `Incorrect interval: "${interval}". E.g. "1h", "1h 5m" "20m"`;

export const Job = Model.extend({
  name: t.String,
  task: t.String,
  interval: property(Interval, '40m'),
  params: t.Object,
  unseen: property(t.Boolean, false)
});

export const reactRouterPropTypes = {
  history: t.Object,
  location: t.Object,
  params: t.Object,
  route: t.Object,
  routeParams: t.Object,
  routes: t.Array
};
