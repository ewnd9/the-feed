import transform from 'curl-to-node';
import got from 'got';

export default {
  task: ({ coordRequest }) => {
    return got.apply(got, transform('got', coordRequest))
      .then(res => {
        const coords = JSON.parse(res.body).coords;
        return Object.keys(coords).map(id => {
          return {
            id,
            avitoId: id
          };
        });
      });
  },
  refine: ({ itemRequest, mockId }, result) => {
    const curl = itemRequest.replace(mockId, result.avitoId);
    return got.apply(got, transform('got', curl))
      .then(res => {
        const body = JSON.parse(res.body).items;
        const item = body[Object.keys(body)[0]];

        result.title = `${item.price} р, ${item.title} ${item.ext && item.ext.address || ''}`;
        result.url = `http://avito.ru${item.url}`;

        return result;
      });
  },
  refineLimit: 1
};
