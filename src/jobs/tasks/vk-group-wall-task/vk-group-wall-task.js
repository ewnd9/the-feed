import vk from '../../../utils/vk';

const task = owner_id => {
  return vk.method('wall.get', { owner_id })
    .then(result => {
      return result.items.map(item => ({
        id: `${item.to_id}_${item.id}`,
        title: `${item.text}`,
        user_url: item.from_id < 0 ? `https://vk.com/club${item.from_id * -1}` : `https://vk.com/id${item.from_id}`
      }));
    });
};

export default { task };
