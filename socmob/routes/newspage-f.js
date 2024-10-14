const express = require('express');
const FNewsRouter = express.Router();
const axios = require('axios');

FNewsRouter.get('', async(req, res) => {
    try {
        const newsAPI = await axios.get(`https://newsdata.io/api/1/news?apikey=pub_56075f99b6e00ecfe77bc6ce29b227bcdcac7&country=au&category=top`);
        const articles = newsAPI.data.results || [];
        
        // Get the article ID from the query parameters
        const articleId = req.query.article_id;
        
        // Find the specific article
        const article = articles.find(a => a.article_id === articleId) || articles[0] || articles[1] || articles[2] || articles[3] || articles[4] || articles[5] || articles[6] || articles[7] || articles[8] || articles[9];
        // console.log('Selected article:', article);
        
        res.render('newspage-fake', { article: article });
    } catch (error) {
        console.error('Error fetching verified news:', error);
        res.render('newspage-fake', { article: {} });
    }
});

module.exports = FNewsRouter;