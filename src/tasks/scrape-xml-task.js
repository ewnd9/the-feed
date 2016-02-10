import got from 'got';
import cheerio from 'cheerio';

export default {
  task: ({ url, selector, urlSelector, titleSelector, additional = {} }) => {
    return got(url).then((res) => {
      const $ = cheerio.load(res.body, {
        normalizeWhitespace: true,
        xmlMode: true
      });

      const result = [];

      return $(selector).toArray().map((el) => {
        const $el = $(el);
        const url = $el.find(urlSelector).text();
        
        const data = Object.keys(additional).reduce((total, name) => {
          total[name] = $el.find(additional[name]).text();
          return total;
        }, {});

        return {
          id: url,
          url: url,
          title: $el.find(titleSelector).text(),
          data
        };
      });
    })
  }
};
