// import vk from './../utils/vk';
const vk = require('./../utils/vk');

const task = query => {
  return vk.method('newsfeed.search', { q: query })
    .then(result => {
      return result.items.map(item => ({
        id: `${item.owner_id}_${item.id}`,
        title: `${item.text}`
      }));
    });
};

export default { task };
