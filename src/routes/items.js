import express from 'express';
import path from 'path';
import sanitize from 'sanitize-html';

export default ({ pouch, db, findAllByStatus, findByCategory, findAllClicked }, tasks) => {

  const router = express.Router();

  router.put('/api/v1/items/:id/seen', (req, res, next) => {
    db.find(req.params.id)
      .then((item) => {
        item.meta.seen = true;
        return db.update(item);
      }).then((result) => {
        res.json(result);
      }).catch((err) => {
        next(err);
      });
  });

  router.put('/api/v1/items/:id/clicked', (req, res, next) => {
    db.find(req.params.id)
      .then((item) => {
        item.meta.clicked_at = new Date().toISOString();
        return db.update(item);
      })
      .then((result) => {
        res.json(result);
      }).catch((err) => {
        next(err);
      });
  });

  router.get('/api/v1/categories', (req, res) => {
    res.json(tasks.map(_ => _.name));
  });

  router.get('/api/v1/categories/items/:id', (req, res, next) => {
    const category = req.params.id;

    const id = req.query.id;
    const date = req.query.date;

    let fn;

    if (category === 'seen') {
      fn = findAllByStatus(true, id, date);
    } else if (category === 'unseen') {
      fn = findAllByStatus(false, id, date);
    } else if (category === 'clicked') {
      fn = findAllClicked(id, date);
    } else {
      fn = findByCategory(category, id, date);
    }

    return fn
      .then(posts => {
        posts.forEach(post => {
          Object.keys(post.data).forEach(key => {
            post.data[key] = sanitize(post.data[key], {
              allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
              allowedAttributes: {
                a: ['href']
              }
            });
          });
        });
        res.json(posts);
      })
      .catch(err => next(err));
  });

  router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
  });

  return router;
};
