import React from 'react';
import styles from './style.css';

import t from 'tcomb';
import { propTypes } from 'tcomb-react';
import { connect } from 'react-redux';
import { markJobAsSeen } from '../../actions/jobs-actions';

import JobLink from '../job-link/job-link';
import { schema } from '../../reducers/jobs-reducer';

const mapStateToProps = ({ jobs }) => ({ jobs });
const mapDispatchToProps = { markJobAsSeen };

const SideMenu = React.createClass({
  propTypes: propTypes({
    jobs: schema,
    markJobAsSeen: t.Function
  }),
  onClick(index) {
    const { jobs: { jobs }, markJobAsSeen } = this.props;
    const job = jobs[index];

    if (job.unseen === true) {
      markJobAsSeen(index);
    }
  },
  render() {
    const { jobs: { jobs } } = this.props;

    return (
      <ul className={styles.sideMenu}>
        {
          jobs.map(({ name, unseen }, index) => (
            <li key={index} className={styles.sideMenuItem}>
              <JobLink jobName={name} onClick={this.onClick.bind(this, index)} />

              { unseen && (
                <span className={styles.unseenBadge}>●</span>
              )}
            </li>
          ))
        }
      </ul>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
