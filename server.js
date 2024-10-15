const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require('fs');  // Import fs for file system operations

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up body parser to handle POST form data (for text fields)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Multer storage configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Define the folder to store images
    },
    filename: (req, file, cb) => {
        // Use original filename or generate a unique one
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid name conflicts
    }
});

const upload = multer({ storage: storage });


// In-memory storage for liked news (replace with a database in a real application)
let likedNews = [];
const dataFilePath = path.join(__dirname, 'data.json');

// Home page route (web-scraped news)
app.get('/', async (req, res) => {
    try {
        const scrapedNews = await scrapeNews();
        const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));  // Read the news from data.json
        res.render('home', { newsList });
    } catch (error) {
        console.error('Error fetching scraped news: check line 25 of server.js');
        res.status(500).send('Error fetching news');
    }
});

// POST route to handle form submission (including file upload)
app.post('/', upload.single('thumbnail'), (req, res) => {
    const { author, heading, content, coordinates } = req.body;
    const thumbnail = req.file;

    // Check if all required fields are provided
    if (!author || !heading || !content || !thumbnail || !coordinates) {
        return res.render('home', {
            errorMessage: 'All fields (author, heading, content, coordinates and thumbnail) are required.'
        });
    }

    // Parse the coordinates into an array
    const coords = JSON.parse(coordinates);

    // Read the current data from data.json
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Calculate the next available ID by finding the highest ID and incrementing it
    const highestId = Math.max(...newsList.map(post => post.id), 0);
    const newPostId = highestId + 1;

    // Create a new post object
    const newPost = {
        id: newPostId,
        author: author,  // You can customize this to get the author from the form
        time: 'Just Now',  // You can set this based on the submission time or get it from the form
        imgSrc: 'images/profile-unknown.jpg',  // You can allow users to upload an avatar image or set a default
        newsImgSrc: `/public/images/${thumbnail.filename}`,  // Path to the uploaded thumbnail image
        ribbonType: 'unverified',  // Default or based on user input
        title: heading,
        content: content,
        coordinates: coords  // You can allow users to enter coordinates or fetch them based on location
    };

    // Add the new post to the beginning of the list (at index 0)
    newsList.unshift(newPost);

    // Sort the newsList by id in descending order (largest to smallest)
    const sortedNewsList = newsList.sort((a, b) => b.id - a.id);

    // Write the updated news list back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(sortedNewsList, null, 2), 'utf8');

    // Redirect to the homepage with a success message
    res.render('home', {
        newsList: sortedNewsList,
        successMessage: 'Post submitted successfully!',
        errorMessage: null  // Clear any error messages
    });
});


// Serve the uploaded image files as static
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));


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
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));  // Read the news from data.json
    res.render('verified-news', { newsList });
});

// START JOJO
app.get('/map', (req, res) => {
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));  // Read the news from data.json
    res.render('map', { newsList });
});

// Serve data.json file via an API endpoint
app.get('/api/data', (req, res) => {
    // const data = require('./data.json'); // Synchronously load the JSON data
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));  // Read the news from data.json
    res.json(newsList); // Send the data as JSON in the response
});

// Route to show individual post based on postId
app.get('/post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const post = newsList.find(p => p.id === postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('post', { post });
});
// END JOJO

app.get('/settings', (req, res) => {
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));  // Read the news from data.json
    res.render('settings', { newsList });
});


app.get('/locations', (req, res) => {
    const newsList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));  // Read the news from data.json
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

