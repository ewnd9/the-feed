import React from 'react';
import styles from './style.css';

import t from 'tcomb';
import { propTypes } from 'tcomb-react';
import { connect } from 'react-redux';
import { markJobAsSeen } from '../../actions/jobs-actions';

import { Link } from 'react-router';
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
          jobs.map(({ _id, name, unseen, interval }, index) => (
            <Item key={name}>
              <div>
                <JobLink jobName={name} onClick={this.onClick.bind(this, index)} />

                { unseen && (
                  <span className={styles.unseenBadge}>●</span>
                )}
              </div>
              <div className={styles.actions}>
                <span>Every {interval}</span>
                {' | '}
                <Link to={`/jobs/${_id}`}>Edit</Link>
              </div>
            </Item>
          ))
        }
        <Item key="new">
          <div>
            <Link to="/jobs/new">Create New</Link>
          </div>
        </Item>
      </ul>
    );
  }
});

function Item({ children }) {
  return (
    <li className={styles.sideMenuItem}>
      {children}
    </li>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
