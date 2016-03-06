import React from 'react';
import styles from './style.css';

import Header from './../header/header';
import SideMenu from './../side-menu/side-menu';

export default React.createClass({
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
