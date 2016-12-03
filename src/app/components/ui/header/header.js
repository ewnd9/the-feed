import React from 'react';
import styles from './style.css';

import { propTypes } from 'tcomb-react';

import { Link } from 'react-router';
import JobLink from '../job-link/job-link';

export default React.createClass({
  propTypes: propTypes({}),
  render() {
    const jobs = [
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
            jobs.map(jobName => (
              <JobLink jobName={jobName} key={jobName} />
            ))
          }
        </div>
      </header>
    );
  }
});
