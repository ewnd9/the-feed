import React from 'react';
import styles from './style.css';

import { provideHooks } from 'redial';
import { fetchCategories } from '../../actions/categories-actions';

import Header from './../header/header';
import SideMenu from './../side-menu/side-menu';

const hooks = {
  fetch: ({ dispatch }) => dispatch(fetchCategories()) // for <SideMenu />
};

const Main = React.createClass({
  render: function() {
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
