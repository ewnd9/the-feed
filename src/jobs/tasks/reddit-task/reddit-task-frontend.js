import t from 'tcomb';

export default {
  params: t.struct({
    subreddits: t.list(t.String)
  })
};
