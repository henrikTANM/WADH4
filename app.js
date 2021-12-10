const express = require('express');
const pool = require('./database');

const app = express();

app.set('view engine', 'ejs');

app.listen(3000);

app.get('/', (req, res) => {
    res.render('posts');
});

app.get('/singlepost', (req, res) => {
    res.render('singlepost');
});

app.get('/addnewpost', (req, res) => {
    res.render('addnewpost');
});

app.use((req, res) => {
    res.status(404).render('404');
});