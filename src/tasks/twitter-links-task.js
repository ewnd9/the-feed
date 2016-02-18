import _ from 'lodash';
import Twitter from 'twitter';
import Promise from 'bluebird';
import url from 'url';

const task = ({
  ignored,
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
}) => {
  const twitter = Promise.promisifyAll(new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
  }));

  return twitter
    .getAsync('statuses/home_timeline')
    .then(result => {
      return result.filter((status) => {
        return status.entities.urls &&
               status.entities.urls.length > 0 &&
               _.any(status.entities.urls, (_url) => (ignored || []).indexOf(url.parse(_url.expanded_url).hostname) === -1);
      });
    }).then(result => {
      return result.map((item) => ({
        id: item.id_str,
        title: `@${item.user.screen_name}: ${item.text}`,
        url: `https://twitter.com/${item.user.screen_name}/status/${item.id_str}`,
        data: {
          user_label: item.user.screen_name,
          user_link: `https://twitter.com/${item.user.screen_name}`
        }
      }));
    });
};

export default { task };
