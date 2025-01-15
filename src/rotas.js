const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));
root.set('view engine','ejs')
const path = require('path');




// PROCURANDO PELA PASTA VIEWS no VERCEL
root.set('views', path.join(__dirname, '..', 'views'));
const { deleteCard, editPost } = require('./controls/modify');
const { loginPage, autLogin, homePage, postPage, isAuthenticated, tipoLogin, deslogar } = require('./controls/users');
const { post_go_db} = require('./controls/newpost');





//const encerrarSessao = require('./middles/encerraSessao');


root.get('/login', loginPage)
root.post('/login', autLogin)

//rotas do adm
//root.use(isAuthenticated)


root.get('/' ,homePage)
root.post('/', post_go_db);

root.get('/exit', loginPage)
root.post('/exit', deslogar)



root.get('/posts/', postPage)

root.get('/posts/:title/', (req, res) => {
    const title = req.params.title;
    const login = tipoLogin(req);
    res.render('pages/edit', { title, user: login });

});

//root.use(run)

root.post('/posts/', deleteCard)
root.post('/posts/:title', editPost)










module.exports = root