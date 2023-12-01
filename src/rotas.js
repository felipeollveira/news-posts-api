const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));
const knex = require('./sql/connect')

const bodyParser = require('body-parser');
root.set('view engine','ejs')


const { deleteCard, editPost } = require('./controls/modify');

const { loginPage, autLogin, homePage, postPage } = require('./controls/users');

const auth = require('./middles/auth');
const { post_go_db, return_get } = require('./controls/newpost');


root.post('/login', autLogin)
root.get('/login', loginPage)
root.post('/' ,post_go_db )
root.get('/api', return_get)
root.get('/', homePage)


root.get('/posts/', postPage)
root.post('/posts/', deleteCard)


root.get('/posts/update/:title/', (req, res) => {
    const title = req.params.title;
    res.render('pages/edit', { title });
});

root.post('/posts/update/:title', editPost)
   








module.exports = root