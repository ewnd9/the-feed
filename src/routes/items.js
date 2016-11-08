import express from 'express';
import sanitize from 'sanitize-html';

export default ({ Item }) => {
  const router = express.Router();

  router.put('/api/v1/items/:id/seen', (req, res, next) => {
    Item
      .updateStatus(req.params.id, true)
      .then(result => {
        res.json(result);
      })
      .catch(err => next(err));
  });

  router.put('/api/v1/items/:id/clicked', (req, res, next) => {
    Item
      .updateClicked(req.params.id)
      .then(result => {
        res.json(result);
      })
      .catch(err => next(err));
  });

  router.get('/api/v1/categories/items/:id', (req, res, next) => {
    const category = req.params.id;

    const id = req.query.id;
    const date = req.query.date;

    let fn;

    if (category === 'seen') {
      fn = Item.findAllByStatus(true, id, date);
    } else if (category === 'unseen') {
      fn = Item.findAllByStatus(false, id, date);
    } else if (category === 'clicked') {
      fn = Item.findAllClicked(id, date);
    } else {
      fn = Item.findByCategory(category, id, date);
    }

    return fn
      .then(posts => {
        posts.forEach(post => cleanPost(post));
        res.json(posts);
      })
      .catch(err => next(err));
  });

  return router;

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
};
