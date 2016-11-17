import t from 'tcomb';
import Router from 'express-router-tcomb';
import sanitize from 'sanitize-html';

import { Post } from '../schema/';

export default ({ postsService }) => {
  const router = Router();

  router.get({
    path: '/api/v1/posts/job/:id',
    schema: {
      response: t.struct({ posts: t.list(Post) })
    },
    handler: (req, res, next) => {
      const job = req.params.id;

      const id = req.query.id;
      const date = req.query.date;

      let fn;

      if (job === 'seen') {
        fn = postsService.findAllByStatus(true, id, date);
      } else if (job === 'unseen') {
        fn = postsService.findAllByStatus(false, id, date);
      } else if (job === 'clicked') {
        fn = postsService.findAllClicked(id, date);
      } else {
        fn = postsService.findByCategory(job, id, date);
      }

      return fn
        .then(posts => {
          posts.forEach(post => cleanPost(post));
          res.json({ posts });
        })
        .catch(err => next(err));
    }
  });

  router.put({
    path: '/api/v1/posts/:id/seen',
    schema: {
      response: t.struct({ post: Post })
    },
    handler: (req, res, next) => {
      postsService
        .updateStatus(req.params.id, true)
        .then(post => res.json({ post }))
        .catch(err => next(err));
    }
  });

  router.put({
    path: '/api/v1/posts/:id/clicked',
    schema: {
      response: t.struct({ post: Post })
    },
    handler: (req, res, next) => {
      postsService
        .updateClicked(req.params.id)
        .then(post => res.json({ post }))
        .catch(err => next(err));
    }
  });

  return router.getRoutes();
};

function cleanPost(post) {
  Object
    .keys(post.data || {})
    .forEach(key => {
      if (typeof post.data[key] === 'string') {
        post.data[key] = sanitize(post.data[key], {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
          allowedAttributes: {
            a: ['href']
          }
        });
      }
    });
}
