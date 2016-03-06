import React from 'react';
import styles from './style.css';

import { Link } from 'react-router';

export default React.createClass({
  render: function() {
    const category = this.props.category;
    const path = `/r/${category.toLowerCase()}`;

    return (
      <Link className={styles.category}
            activeClassName={styles.active}
            key={category}
            to={path}>
        {category}
      </Link>
    );
  }
});
