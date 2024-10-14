const express = require('express');
const newsRouter = express.Router();
const axios = require('axios');


newsRouter.get('', async(req, res) => {
    //res.render('home');

    try {
        const newsAPI = await axios.get(`https://newsdata.io/api/1/news?apikey=pub_56075f99b6e00ecfe77bc6ce29b227bcdcac7&country=au&category=top`);
        //console.log(newsAPI.data);
        const articles = newsAPI.data.results || [];
        res.render('home', {articles: articles});

    } catch (error) {
        if(error.response){
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request){
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    }
    
});

// newsRouter.get('/:article_id', async(req, res) => {
//     let articleID = req.params.article_id//res.render('home');

//     try {
//         const newsAPI = await axios.get(`https://newsdata.io/api/1/news?apikey=pub_56075f99b6e00ecfe77bc6ce29b227bcdcac7&country=au&category=top/${articleID}`);
//         //console.log(newsAPI.data);
//         res.render('newspage-verified', {article: newsAPI.data.results});
//         // res.render('newspage-unverified', {article: newsAPI.data.results});
//         // res.render('newspage-fake', {article: newsAPI.data.results});

//     } catch (error) {
//         if(error.response){
//             console.log(error.response.data);
//             console.log(error.response.status);
//             console.log(error.response.headers);
//         } else if (error.request){
//             console.log(error.request);
//         } else {
//             console.log('Error', error.message);
//         }
//     }
    
// });

module.exports = newsRouter;

 

