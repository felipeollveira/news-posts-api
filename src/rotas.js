const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));

const bodyParser = require('body-parser');
root.set('view engine','ejs')


const { deleteCard } = require('./controls/modify');

const { loginPage, autLogin, homePage, postPage } = require('./controls/users');

const auth = require('./middles/auth');
const { post_go_db, return_get } = require('./controls/newpost');


root.post('/', autLogin)
root.get('/', loginPage)
root.post('/home' ,post_go_db )
root.get('/api', return_get)
root.get('/home', homePage)

root.post('/posts/del', deleteCard)
root.get('/posts/edit', homePage)

root.get('/posts', postPage)




module.exports = root