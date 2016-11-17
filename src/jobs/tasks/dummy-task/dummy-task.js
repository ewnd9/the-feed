export default {
  task: () => {
    const testItem = {
      id: '1',
      title: 'test-1',
      url: 'http://ewnd9.com/',
      data: {}
    };

    return Promise.resolve([testItem]);
  }
};
