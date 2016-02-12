import Xray from 'x-ray';
import Promise from 'bluebird';

const x = Xray();

const task = ({ url, selector, titleSelector, urlSelector, additional = {} }) => {
  return new Promise((resolve, reject) => {
    const params = {
      title: titleSelector,
      url: urlSelector,
      id: urlSelector
    };

    x(url, {
      items: x(selector, [{
        ...params,
        ...additional
      }])
    })((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.items);
      }
    });
  });
};

export default { task };
