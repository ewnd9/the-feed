import Router from 'express-router-tcomb';
import { Item } from '../schema/';

export default ({ itemsService }) => {
  const router = Router();

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
