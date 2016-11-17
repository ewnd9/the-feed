import t from 'tcomb';
import Router from 'express-router-tcomb';
import sanitize from 'sanitize-html';

import { Item } from '../schema/';

export default ({ itemsService }) => {
  const router = Router();

  router.get({
    path: '/api/v1/items/category/:id',
    schema: {
      response: t.list(Item)
    },
    handler: (req, res, next) => {
      const category = req.params.id;

      const id = req.query.id;
      const date = req.query.date;

      let fn;

      if (category === 'seen') {
        fn = itemsService.findAllByStatus(true, id, date);
      } else if (category === 'unseen') {
        fn = itemsService.findAllByStatus(false, id, date);
      } else if (category === 'clicked') {
        fn = itemsService.findAllClicked(id, date);
      } else {
        fn = itemsService.findByCategory(category, id, date);
      }

      return fn
        .then(posts => {
          posts.forEach(post => cleanPost(post));
          res.json(posts);
        })
        .catch(err => next(err));
    }
  });

  router.put({
    path: '/api/v1/items/:id/seen',
    schema: {
      response: Item
    },
    handler: (req, res, next) => {
      itemsService
        .updateStatus(req.params.id, true)
        .then(result => res.json(result))
        .catch(err => next(err));
    }
  });

  router.put({
    path: '/api/v1/items/:id/clicked',
    schema: {
      response: Item
    },
    handler: (req, res, next) => {
      itemsService
        .updateClicked(req.params.id)
        .then(result => res.json(result))
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
