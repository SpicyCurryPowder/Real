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
const newsList = [
    { id: 1, author: 'Bob Smith', time: '2 min ago', imgSrc: 'images/profile-1.jpg', newsImgSrc: 'images/techrevol.jpg', 
        title: 'Breaking News: New Tech Revolution!', content: 'A major breakthrough in artificial intelligence is set to change the world as we know it. ThirdEye Data ', 
        coordinates: [37.3288, -121.8935] },
    { id: 2, author: 'Evelyn Harris', time: '12 min ago', imgSrc: 'images/profile-4.png', newsImgSrc: 'images/soccer.jpg', 
        title: 'Sports Update: Soccer World Cup 2024', content: 'The World Cup is heating up, with new teams making surprising advances. 2024 ICC Women\'s T20 World Cup',
        coordinates: [25.04681, 55.21928] },
    { id: 3, author: 'Dana Lee', time: '1h ago', imgSrc: 'images/profile-3.jpg', newsImgSrc: 'images/hurricaneMilton.jpg', 
        title: 'Weather Alert: Hurricane Approaching', content: 'A powerful storm is set to hit the east coast. Preparations are underway.',
        coordinates: [27.2667, -82.5465] },
    { id: 4, author: 'Alice Johnson', time: '2h ago', imgSrc: 'images/profile-2.jpg', newsImgSrc: 'images/vaccine.jpg', 
        title: 'Health News: New Vaccine Approved', content: 'A new vaccine has been approved for public use, offering protection against the latest strain of the flu.',
        coordinates: [40.75515, -73.9995]}
];

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

// Verified news page route (API-based news)
app.get('/verified-news', async (req, res) => {
    try {
        const verifiedNews = await fetchVerifiedNews();
        res.render('verified-news', { news: verifiedNews, likedNews });
    } catch (error) {
        console.error('Error fetching verified news: check line 37 of server.js', );
        // console.error('Error fetching verified news:', error);
        res.status(500).send('Error fetching news');
    }
});

// Liked news page route
app.get('/liked-news', (req, res) => {
    res.render('liked-news', { likedNews });
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