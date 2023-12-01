const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));
root.set('view engine','ejs')
const path = require('path');

// PROCURANDO PELA PASTA VIEWS no VERCEL
root.set('views', path.join(__dirname, '..', 'views'));

const { deleteCard, editPost } = require('./controls/modify');

const { loginPage, autLogin, homePage, postPage, isAuthenticated } = require('./controls/users');

const { post_go_db} = require('./controls/newpost');


root.post('/login', autLogin)
root.get('/login', loginPage)

root.post('/' ,isAuthenticated ,post_go_db )
root.get('/', isAuthenticated ,homePage)


root.get('/posts/', isAuthenticated, postPage)
root.post('/posts/',isAuthenticated, deleteCard)


root.get('/posts/update/:title/', (req, res) => {
    const title = req.params.title;
    res.render('pages/edit', { title });
});

root.post('/posts/update/:title', editPost)
   








module.exports = root