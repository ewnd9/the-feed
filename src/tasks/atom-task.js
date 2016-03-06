import task from './scrape-xml-task';

const selector = 'entry';
const titleSelector = 'title';
const urlSelector = 'id';
const additional = {
  description_label: 'content'
};

export default {
  task: ({ url }) => {
    return task.task({ url, selector, titleSelector, urlSelector, additional });
  }
};
