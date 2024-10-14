const express = require('express');
const verifiedNewsRouter = express.Router();
const axios = require('axios');

verifiedNewsRouter.get('', async(req, res) => {
    try {
        const newsAPI = await axios.get(`https://newsdata.io/api/1/news?apikey=pub_56075f99b6e00ecfe77bc6ce29b227bcdcac7&q=brisbane&country=au&language=en&category=business,environment,politics`);
        const articles = newsAPI.data.results || [];
        res.render('verified-news', { articles: articles });
    } catch (error) {
        console.error('Error fetching verified news:', error);
        res.render('verified-news', { articles: [] });
    }
});

module.exports = verifiedNewsRouter;