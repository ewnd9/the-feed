import express from 'express';
import path from 'path';
import sanitize from 'sanitize-html';

export default ({ pouch, db, Category }, tasks) => {
  const router = express.Router();

  router.get('/api/v1/categories', (req, res, next) => {
    Category
      .findUnseenCategories()
      .then(data => {
        res.json(tasks.map(_ => ({
          name: _.name,
          unseen: (data.find(category => category.task === _.name) || { unseen: false }).unseen
        })));
      })
      .catch(err => next(err));
  });

  router.put('/api/v1/categories/:id', (req, res, next) => {
    return Category
      .setCategoryAsSeen(req.params.id)
      .then(item => {
        res.json('ok');
      })
      .catch(err => next(err));
  });

  return router;
};
