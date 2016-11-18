const req = require.context('../jobs/tasks', true, /\-task-frontend\.js$/igm);
const tasks = req
  .keys()
  .reduce(
    (total, path) => {
      const name = path.split('/')[1];
      total[name] = req(path).default;

      return total;
    },
    {}
  );

export default tasks;
