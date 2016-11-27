import React from 'react';
import styles from './style.css';

import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import t from 'tcomb-form';
import { propTypes } from 'tcomb-react';

import tasks from '../../tasks';
import { schema } from '../../reducers/jobs-reducer';
import { Job, reactRouterPropTypes } from '../../../schema';
import { createInstance } from 'tcomb-property';

import { upsertJob, fetchJobs, updateJobValue } from '../../actions/jobs-actions';

const mapStateToProps = ({ jobs }) => ({ jobs });
const mapDispatchToProps = { upsertJob, fetchJobs, updateJobValue };

const taskName = Object.keys(tasks)[0];
const task = tasks[taskName];
const defaultJob = () => createInstance(Job, { task: taskName });

const hooks = {
  fetch({ dispatch, params, getState }) {
    if (!params.id) {
      return dispatch(updateJobValue(defaultJob()));
    }

    return dispatch(fetchJobs())
      .then(() => {
        const jobs = getState().jobs.jobs;
        const job = jobs.find(job => job.name === params.id) || defaultJob();

        return dispatch(updateJobValue(job));
      });
  }
};

const options = {
  fields: {
    _id: {
      type: 'hidden'
    },
    _rev: {
      type: 'hidden'
    },
    _key: {
      type: 'hidden'
    },
    updatedAt: {
      type: 'hidden'
    },
    task: {
      nullOption: false
    },
    unseen: {
      type: 'hidden'
    }
  }
};

const JobForm = React.createClass({
  propTypes: propTypes({
    ...reactRouterPropTypes,
    jobs: schema,

    children: t.Nil,
    upsertJob: t.Function,
    fetchJobs: t.Function,
    updateJobValue: t.Function
  }),
  getInitialState() {
    return { FormSchema: createSchema(task.params) };
  },
  componentWillReceiveProps(nextProps) {
    const { jobs: { job } } = this.props;
    const { jobs: { job: nextJob } } = nextProps;

    if (nextJob && (!job || job.task !== nextJob.task)) {
      const task = tasks[nextJob.task];
      this.setState({ FormSchema: createSchema(task.params) });
    }
  },
  onChange(job) {
    const { updateJobValue } = this.props;
    updateJobValue(job);
  },
  onSubmit(e) {
    const { upsertJob, fetchJobs } = this.props;

    e.preventDefault();
    const job = this.refs.form.getValue();

    if (job) {
      upsertJob(job)
        .then(res => {
          return fetchJobs(true)
            .then(() => this.context.router.push(`/jobs/${res.response.job._id}`));
        });
    } else {
      console.log('invalid', job, this.refs.form.validate());
    }
  },
  render() {
    const { FormSchema } = this.state;
    const { jobs: { job } } = this.props;

    return (
      <div>
        <form onSubmit={this.onSubmit} className={`form ${styles.form}`}>
          <div className={styles.fields}>
            <t.form.Form key={job && job._id} ref="form" value={job} type={FormSchema} options={options} onChange={this.onChange} />
          </div>

          <div className={styles.submitGroup}>
            <button type="submit" className={styles.submitButton}>Save</button>
          </div>
        </form>
      </div>
    );
  }
});

JobForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function createSchema(params) {
  return t.struct({
    ...Job.meta.props,
    task: t.enums.of(Object.keys(tasks)),
    unseen: t.maybe(t.Boolean),
    params
  });
}

export default provideHooks(hooks)(connect(mapStateToProps, mapDispatchToProps)(JobForm));
