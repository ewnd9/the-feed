import t from 'tcomb';
import Router from 'express-router-tcomb';
import { Job } from '../schema/';

export default ({ jobsService }) => {
  const router = Router();

  router.get({
    path: '/api/v1/jobs',
    schema: {
      response: t.struct({ jobs: t.list(Job) })
    },
    handler: (req, res, next) => {
      jobsService
        .findAll()
        .then(jobs => res.json({ jobs }))
        .catch(err => next(err));
    }
  });

  router.put({
    path: '/api/v1/jobs',
    schema: {
      body: t.struct({ job: Job }),
      response: t.struct({ job: Job })
    },
    handler: (req, res, next) => {
      jobsService
        .create(req.body.job)
        .then(job => res.json({ job }))
        .catch(err => next(err));
    }
  });

  router.post({
    path: '/api/v1/jobs',
    schema: {
      body: t.struct({ job: Job }),
      response: t.struct({ job: Job })
    },
    handler: (req, res, next) => {
      jobsService
        .update(req.body.job)
        .then(job => res.json({ job }))
        .catch(err => next(err));
    }
  });

  return router.getRoutes();
};
