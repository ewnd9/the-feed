import React from 'react';
import styles from './style.css';

import { Link } from 'react-router';

export default React.createClass({
  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  },
  render: function() {
    const category = this.props.category;
    const path = `/r/${category.toLowerCase()}`;

    return (
      <Link className={styles.category}
            activeClassName={styles.active}
            key={category}
            onClick={this.onClick}
            to={path}>
        {category}
      </Link>
    );
  }
});
