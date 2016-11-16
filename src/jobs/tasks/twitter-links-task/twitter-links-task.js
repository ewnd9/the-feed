import _ from 'lodash';
import Twitter from 'twitter';
import Promise from 'bluebird';
import url from 'url';

import getTitleFromUrl from '../../../utils/get-title-from-url';

const getTwitter = ({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
}) => {
  return Promise.promisifyAll(new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
  }));
};

const task = params => {
  const { ignored } = params;
  const twitter = getTwitter(params);

  return twitter
    .getAsync('statuses/home_timeline')
    .then(result => {
      return result.filter(status => {
        return status.entities.urls &&
               status.entities.urls.length > 0 &&
               _.any(status.entities.urls, _url => (ignored || []).indexOf(url.parse(_url.expanded_url).hostname) === -1);
      });
    }).then(result => {
      return result.map(item => ({
        id: item.id_str,
        title: `@${item.user.screen_name}: ${item.text}`,
        url: item.entities.urls[0].expanded_url,
        data: {
          user_label: item.user.screen_name,
          user_link: `https://twitter.com/${item.user.screen_name}`,
          tweet_label: 'tweet',
          tweet_link: `https://twitter.com/${item.user.screen_name}/status/${item.id_str}`
        }
      }));
    });
};

const refine = (params, item) => {
  return getTitleFromUrl(item.url).then(title => {
    item.title = title;
    item.data.site_label = url.parse(item.url).hostname;
    item.data.site_link = url.parse(item.url).hostname;

    return item;
  });
};

export default {
  task,
  refine
};
