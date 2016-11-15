import proxyquire from 'proxyquire';

export default () => {
  const createApp = proxyquire('../../src/server', {
    './config': {
      default: {
        db: `/tmp/the-feed-${Math.random()}`,
        'disable-tasks': true
      },
      jobs: [
        {
          name: 'dummy-job',
          task: 'dummy'
        }
      ]
    }
  }).default;

  return createApp();
};
