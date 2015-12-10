import got from 'got';
import cheerio from 'cheerio';

export default {
	task: ({ url, selector, urlSelector, titleSelector }) => {
		return got(url).then((res) => {
			const $ = cheerio.load(res.body, {
			  normalizeWhitespace: true,
				xmlMode: true
			});

			const result = [];

			return $(selector).toArray().map((el) => {
				const $el = $(el);
				const url = $el.find(urlSelector).text();

				return {
					id: url,
					url: url,
					title: $el.find(titleSelector).text()
				};
			});
		})
	}
};
