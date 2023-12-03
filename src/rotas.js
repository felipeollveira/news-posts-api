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

//rotas protegidas
root.use(isAuthenticated)

root.post('/'  ,post_go_db )
root.get('/' ,homePage)


root.get('/posts/', postPage)
root.post('/posts/', deleteCard)


root.get('/posts/update/:title/', (req, res) => {
    const title = req.params.title;
    res.render('pages/edit', { title });
});

root.post('/posts/update/:title', editPost)
   








module.exports = root