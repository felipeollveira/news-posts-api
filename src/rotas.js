const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));

const bodyParser = require('body-parser');
root.set('view engine','ejs')

const { loginPage, autLogin, homePage } = require('./controls/users');

const auth = require('./middles/auth');
const { post_go_db, return_get } = require('./controls/newpost');


root.post('/', autLogin)
root.get('/', loginPage)
root.post('/home' ,post_go_db )
root.get('/api', return_get)

root.get('/:id', homePage)


module.exports = root