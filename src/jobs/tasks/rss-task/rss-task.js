import task from '../scrape-xml-task/scrape-xml-task';

const selector = 'item';
const titleSelector = 'title';
const urlSelector = 'link';
const additional = {
  description_label: 'description'
};

export default {
  task: ({ url }) => {
    return task.task({ url, selector, titleSelector, urlSelector, additional });
  }
};
