export default JobsService;

function JobsService({ Job }) {
  this.Job = Job;
}

JobsService.prototype.findAll = function() {
  return this.Job.findAll();
};

JobsService.prototype.findOneByName = function(name) {
  return this.Job.findOne({ name });
};

JobsService.prototype.create = function(data) {
  return this.Job.put(data);
};

JobsService.prototype.update = function(data) {
  return this.Job.findOne(data).then(() => this.Job.put(data));
};
