const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for liked news (replace with a database in a real application)
let likedNews = [];
const newsList = require('./data.json');

// Home page route (web-scraped news)
app.get('/', async (req, res) => {
    try {
        const scrapedNews = await scrapeNews();
        res.render('home', { newsList });
    } catch (error) {
        console.error('Error fetching scraped news: check line 25 of server.js');
        // console.error('Error fetching scraped news:', error);
        res.status(500).send('Error fetching news');
    }
});

app.get('/newspage-unverified', (req, res) => {
    res.render('newspage-unverified', { article: req.query });
});

app.get('/newspage-verified', (req, res) => {
    res.render('newspage-verified', { article: req.query });
});

app.get('/source-news', (req, res) => {
    res.render('source-news');
});

app.get('/verified-news', (req, res) => {
    res.render('verified-news', { newsList });
});

app.get('/map', (req, res) => {
    res.render('map', { newsList });
});

// Route to show individual post based on postId
app.get('/post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // console.log(postId);
    const post = newsList.find(p => p.id === postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('post', { post });
});

app.get('/locations', (req, res) => {
    res.json(newsList);
});

// Serve data.json file via an API endpoint
app.get('/api/data', (req, res) => {
    const data = require('./data.json'); // Synchronously load the JSON data
    res.json(data); // Send the data as JSON in the response
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
async function scrapeNews() {
    try {
        const response = await axios.get('https://www.reuters.com/fact-check/');
        const $ = cheerio.load(response.data);
        const news = [];

        $('.news-item').each((index, element) => {
            const title = $(element).find('.title').text();
            const description = $(element).find('.description').text();
            news.push({ id: `scraped-${index}`, title, description, source: 'Web Scrape' });
        });

        return news;
    } catch (error) {
        console.error('Error scraping news: check line 78 of server.js');
        // console.error('Error scraping news:', error);
        return [];
    }
}

// API news fetching function
async function fetchVerifiedNews() {
    try {
        const API_KEY = 'your_api_key_here';
        const API_URL = 'https://newsapi.org/v2/top-headlines';

        const response = await axios.get(API_URL, {
            params: {
                country: 'us',
                apiKey: API_KEY,
            },
        });

        return response.data.articles.map((article, index) => ({
            id: `api-${index}`,
            title: article.title,
            description: article.description,
            source: 'API',
        }));
    } catch (error) {
        console.error('Error fetching verified news: check line 104 of server.js');
        // console.error('Error fetching verified news:', error);
        return [];
    }
}

app.listen(port, () => {
    console.log(`News aggregator app listening at http://localhost:${port}`);
});