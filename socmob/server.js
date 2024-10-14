const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
//const { scrapeReutersFactCheck } = require('./newsScraper');

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine - TEMPLATE ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
const newsRouter = require('./routes/news-home')
const verifiedNewsRouter = require('./routes/news-verified')
const pageNewsRouter = require('./routes/newspage')
const UVNewsRouter = require('./routes/newspage-uv')
const FNewsRouter = require('./routes/newspage-f')


app.use('/', newsRouter);

app.use('/newspage-verified', pageNewsRouter);
app.use('/newspage-unverified', UVNewsRouter);
app.use('/newspage-fake', FNewsRouter);
app.use('/verified-news', verifiedNewsRouter);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// // In-memory storage for liked news (replace with a database in a real application)
// let likedNews = [];

// // Home page route (web-scraped news)
// app.get('/', async (req, res) => {
//   try {
//     const news = await scrapeReutersFactCheck();
//     res.render('home', { news, likedNews });
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     res.render('home', { news: [], likedNews });
//   }
// });

// // Verified news page route (API-based news)
// app.get('/verified-news', async (req, res) => {
//   try {
//     const verifiedNews = await fetchVerifiedNews();
//     res.render('verified-news', { news: verifiedNews, likedNews });
//   } catch (error) {
//     console.error('Error fetching verified news:', error);
//     res.status(500).send('Error fetching news');
//   }
// });


//newspage-verified route
// app.get('/newspage-verified', (req, res) => {
//   const article = {
//       articleId: req.query.articleId,
//       title: req.query.title,
//       description: req.query.description,
//       sourceId: req.query.sourceId,
//       image_url: req.query.image_url
//   };
//   res.render('newspage-verified', { article: article });
// });




// Page ROUTES
app.get('/source-news', (req, res) => {
  res.render('source-news');
});
app.get('/newspage-news', (req, res) => {
  res.render('newspage-news');
});

app.get('/newspage-verified', (req, res) => {
  res.render('newspage-verified', { article: req.query });
});

app.get('/newspage-unverified', (req, res) => {
  res.render('newspage-unverified', { article: req.query });
});

app.get('/newspage-fake', (req, res) => {
  res.render('newspage-fake', { article: req.query });
});






// Like/unlike news route
app.post('/toggle-like/:id', express.json(), (req, res) => {
  const { id } = req.params;
  const { title, description, source } = req.body;

  const existingIndex = likedNews.findIndex(item => item.id === id);
  if (existingIndex !== -1) {
    likedNews.splice(existingIndex, 1);
  } else {
    likedNews.push({ id, title, description, source });
  }

  res.json({ success: true });
});

// Web scraping function
// async function scrapeNews() {
//   try {
//     const response = await axios.get('https://www.reuters.com/fact-check/');
//     const $ = cheerio.load(response.data);
//     const news = [];

//     $('.news-item').each((index, element) => {
//       const title = $(element).find('.title').text();
//       const description = $(element).find('.description').text();
//       news.push({ id: `scraped-${index}`, title, description, source: 'Web Scrape' });
//     });

//     return news;
//   } catch (error) {
//     console.error('Error scraping news:', error);
//     return [];
//   }
// }

// API news fetching function
// async function fetchVerifiedNews() {
//   try {
//     const API_KEY = 'your_api_key_here';
//     const API_URL = 'https://newsapi.org/v2/top-headlines';

//     const response = await axios.get(API_URL, {
//       params: {
//         country: 'us',
//         apiKey: API_KEY,
//       },
//     });

//     return response.data.articles.map((article, index) => ({
//       id: `api-${index}`,
//       title: article.title,
//       description: article.description,
//       source: 'API',
//     }));
//   } catch (error) {
//     console.error('Error fetching verified news:', error);
//     return [];
//   }
// }

app.listen(port, () => {
  console.log(`Real . is listening at http://localhost:${port}`);
});
