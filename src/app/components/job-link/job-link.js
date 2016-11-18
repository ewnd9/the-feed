import React from 'react';
import styles from './style.css';

import t from 'tcomb';
import { propTypes } from 'tcomb-react';
import { Link } from 'react-router';

export default React.createClass({
  propTypes: propTypes({
    jobName: t.String,
    onClick: t.maybe(t.Function)
  }),
  onClick() {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }
  },
  render: function() {
    const { jobName } = this.props;
    const path = `/r/${encodeURIComponent(jobName.toLowerCase())}`;

    return (
      <Link className={styles.category}
            activeClassName={styles.active}
            onClick={this.onClick}
            to={path}>
        {jobName}
      </Link>
    );
  }
});
