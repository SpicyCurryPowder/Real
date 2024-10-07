const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeReutersFactCheck() {
  try {
    const response = await axios.get('https://www.reuters.com/fact-check/');
    const $ = cheerio.load(response.data);
    const articles = [];

    $('.media-story-card').each((index, element) => {
      const $element = $(element);
      const title = $element.find('.media-story-card__heading__eqhp9').text().trim();
      const description = $element.find('.media-story-card__description__3xbK_').text().trim();
      const imageUrl = $element.find('img').attr('src');

      articles.push({
        id: `reuters-${index}`,
        title,
        description,
        imageUrl,
        source: 'Reuters Fact Check'
      });
    });

    return articles;
  } catch (error) {
    console.error('Error scraping Reuters Fact Check:', error);
    return [];
  }
}

module.exports = { scrapeReutersFactCheck };
