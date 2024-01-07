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
const { run } = require('./sql/connect');




//const encerrarSessao = require('./middles/encerraSessao');


root.get('/login', loginPage)
root.post('/login', autLogin)

//rotas protegidas
root.use(isAuthenticated)


root.get('/' ,homePage)
root.post('/' ,post_go_db)


root.get('/posts/', postPage)

root.get('/posts/update/:title/', (req, res) => {
    const title = req.params.title;
    res.render('pages/edit', { title });
});

//root.use(run)

root.post('/posts/', deleteCard)
root.post('/posts/update/:title', editPost)










module.exports = root