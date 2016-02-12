import _ from 'lodash';
import Twitter from 'twitter';
import Promise from 'bluebird';

const task = ({
  user,
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

  const params = {
    q: user,
    count: 100,
    result_type: 'recent'
  };

  return twitter
    .getAsync('search/tweets', params)
    .then(result => {
      const isNotSelfQuoted = status => (!status.quoted_status || status.quoted_status.user.screen_name !== user)
      const isNotSelfMention = status => !_.any(status.entities.user_mentions, mention => mention.screen_name === user);

      const xs = result.statuses.filter(status => {
        return status.user.screen_name !== user &&
               isNotSelfQuoted(status) &&
               isNotSelfMention(status);
      });

      return xs.map(item => ({
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
