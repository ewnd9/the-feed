import React from 'react';
import styles from './style.css';

import { Link } from 'react-router';
import CategoryLink from './../category-link/category-link';

export default React.createClass({
  render: function() {
    const categories = [
      'Clicked',
      'Seen'
    ];

    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">the-feed</Link>
        </div>
        <div className={styles.menu}>
          {
            categories.map(category => {
              return (<CategoryLink category={category} key={category} />);
            })
          }
        </div>
      </header>
    );
  }
});
