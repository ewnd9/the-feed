import got from 'got';
import cheerio from 'cheerio';

export default url => {
  return got(url).then(res => {
    const $ = cheerio.load(res.body, {
      normalizeWhitespace: true,
      xmlMode: true
    });

    return $('title').text();
  });
};
