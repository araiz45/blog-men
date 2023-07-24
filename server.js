const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article")
const articleRouter = require("./routes/article")
const methodOverRide = require("method-override");

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/test')

app.set("view engine", 'ejs');

app.use(express.urlencoded({extended: false}))

app.use(methodOverRide('_method'))


app.get('/', async (req, res) =>{
    const article = await Article.find().sort({
        createdAt: 'desc'
    });
    res.render("articles/index", {articles: article})
})
app.use('/articles', articleRouter);
app.listen(5000);