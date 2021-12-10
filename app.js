const express = require('express');
const pool = require('./database');
const cors = require('cors');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('Public'));
app.use('/assets', express.static('assets'));

app.listen(3000);




app.get('/', async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query(
            "SELECT * FROM poststable ORDER BY id DESC"
        );
        res.render('posts', { posts: posts.rows });
    } catch (err) {
        console.error(err.message);
    }
});

// app.get('/like', async(req, res) => {
//     try {
//         const post = req.params;
//         console.log(post);
//         res.render('like', { post: posts.row });
//     } catch (err) {
//         console.error(err.message);
//     }
// });

app.get('/singlepost/:id', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params.id);
        console.log("get a single post request has arrived");
        const post = await pool.query(
            "SELECT * FROM poststable WHERE id = $1", [id]
        );
        res.render('singlepost', { post: post.rows[0] });
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/:id', async(req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const post = req.body;
        console.log("delete a post request has arrived");
        const deletepost = await pool.query(
            "DELETE FROM poststable WHERE id = $1", [id]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
    }
   });

app.post('/', async(req, res) => {
    try {
        const post = req.body;
        console.log(post);
        const lastpost = await pool.query(
            "SELECT MAX(id) AS last FROM poststable"
        );
        const id = lastpost.rows[0].last + 1;
        const newpost = await pool.query(
            "INSERT INTO poststable(id, title, body, name, likes) values ($1, $2, $3, $4, $5)RETURNING*", [id, post.title, post.body, post.name, 0]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err.message)
    }
});

app.put('/:id', async(req, res) => {
    try {
        console.log("update a post request has arrived");
        const { id } = req.params;
        const likes = await pool.query(
            "SELECT likes FROM poststable WHERE id = $1", [id]
        );
        const updatepost = await pool.query(
            "UPDATE poststable SET likes = $2 WHERE id = $1", [id, likes.rows[0].likes + 1]
        );
    } catch (err) {
        console.log(err.message)
    }
});




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