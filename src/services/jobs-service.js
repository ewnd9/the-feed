import TaskManager from '../jobs/task-manager';
import parseInterval from '../utils/parse-interval';

export default JobsService;

function JobsService({ Job }) {
  this.Job = Job;
  this.refs = {};
}

JobsService.prototype.findAll = function() {
  return this.Job.findAll();
};

JobsService.prototype.findOneByName = function(name) {
  return this.Job.findOne({ name });
};

JobsService.prototype.create = function(data) {
  return this.Job
    .put(data)
    .then(job => this.startJob(job));
};

JobsService.prototype.update = function(data) {
  return this.Job
    .findOne(data)
    .then(prevValue => {
      if (prevValue._id !== this.Job._createId(data)) {
        data._id = this.Job._createId(data);
        data._rev = null;

        return this.Job.db.remove(prevValue)
          .then(() => this.Job.put(data));
      }

      return this.Job.put(data);
    })
    .then(job => this.startJob(job));
};

JobsService.prototype.init = function() {
  this.manager = new TaskManager(this.services);

  return this
    .findAll()
    .then(jobs => {
      jobs.forEach((job, i) => this.startJob(job, i * 1000 * 10));
      return jobs;
    });
};

JobsService.prototype.startJob = function(job, timeout = 0) {
  if (this.manager) {
    clearTimeout(this.refs[job.name]);
    clearInterval(this.refs[job.name]);

    this.refs[job.name] = setTimeout(() => {
      const fn = this.manager.runJob.bind(this.manager, job);

      this.refs[job.name] = setInterval(fn, 1000 * 60 * parseInterval(job.interval));
      fn();
    }, timeout);
  }

  return job;
};

JobsService.prototype.updateUnseenStatus = function(job, status) {
  return this.Job
    .findOne(job)
    .then(
      job => {
        job.unseen = status;
        return this.Job.put(job);
      },
      err => {
        if (err.reason !== 'missing') {
          return Promise.reject(err);
        } else {
          return Promise.reject(new Error(`Can't find job: "${job.name}"`));
        }
      }
    );
};
