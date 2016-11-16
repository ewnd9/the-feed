import t from 'tcomb';
import Router from 'express-router-tcomb';
import sanitize from 'sanitize-html';

import { Category, Item } from '../schema/';

export default ({ itemsService, categoriesService }, tasks) => {
  const router = Router();

  router.get({
    path: '/api/v1/categories',
    schema: {
      response: t.list(Category)
    },
    handler: (req, res, next) => {
      categoriesService
        .findUnseenCategories()
        .then(categories => {
          res.json(tasks.map(task => {
            const category = categories.find(category => category.task === task.name);

            return category || {
              name: task.name
            };
          }));
        })
        .catch(err => next(err));
    }
  });

  router.put({
    path: '/api/v1/categories/:id',
    schema: {
      response: Category
    },
    handler: (req, res, next) => {
      categoriesService
        .setCategoryAsSeen(req.params.id)
        .then(category => res.json(category))
        .catch(err => next(err));
    }
  });

  router.get({
    path: '/api/v1/categories/items/:id',
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

  return router.getRoutes();
};

function cleanPost(post) {
  Object
    .keys(post.data || {})
    .forEach(key => {
      post.data[key] = sanitize(post.data[key], {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
        allowedAttributes: {
          a: ['href']
        }
      });
    });
}
