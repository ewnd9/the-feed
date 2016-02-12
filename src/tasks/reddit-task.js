import got from 'got';

const task = ({ subreddits }) => {
  return got(`https://api.reddit.com/r/${subreddits.join('+')}/new`, {
    json: true
  }).then((res) => {
    return res.body.data.children.map(({ data }) => {
      let images;

      if (data.preview) {
        images = data.preview.images[0].resolutions.concat(data.preview.images[0].source);
      }

      return {
        title: `/r/${data.subreddit}: ${data.title}`,
        url: data.url,
        id: `${data.subreddit}${data.id}`,
        data: {
          flair_label: data.link_flair_text,
          comments_link: `https://reddit.com${data.permalink}`,
          comments_link_count: data.num_comments,
          text_blob: data.selftext
        },
        images
      };
    });
  });
};

export default { task };
