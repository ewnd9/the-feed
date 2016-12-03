import React from 'react';
import styles from './style.css';

import { propTypes } from 'tcomb-react';

import { provideHooks } from 'redial';
import { fetchJobs } from '../../actions/jobs-actions';

import Header from '../ui/header/header';
import SideMenu from '../ui/side-menu/side-menu';

import t from 'tcomb';
import { reactRouterPropTypes } from '../../../schema/';

const hooks = {
  fetch: ({ dispatch }) => dispatch(fetchJobs()) // for <SideMenu />
};

const Main = React.createClass({
  propTypes: propTypes({
    ...reactRouterPropTypes,
    children: t.ReactNode
  }),
  render() {
    return (
      <div className={styles.container}>
        <Header />

        <div className={styles.main}>
          <aside className={styles.aside}>
            <SideMenu />
          </aside>

          <div className={styles.content}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

export default provideHooks(hooks)(Main);
