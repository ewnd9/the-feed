import React from 'react';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Main from './components/main/main';
import PostsList from './components/posts-list/posts-list';
import JobForm from './components/job-form/job-form';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={PostsList} />
      <Route path="/r/:categoryId" component={PostsList} />
      <Route path="/jobs/new" component={JobForm} />
      <Route path="/jobs/:id" component={JobForm} />
    </Route>
  </Router>
);

export default routes;
