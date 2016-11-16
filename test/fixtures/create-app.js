import proxyquire from 'proxyquire';

export default () => {
  const createApp = proxyquire('../../src/server', {
    './config': {
      default: {
        db: `/tmp/the-feed-${Math.random()}`,
        'disable-tasks': true,
        port: 1024 + (Math.random() * (65536 - 1024) | 0)
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
