const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));
root.set('view engine','ejs')
const path = require('path');

const fs = require('fs').promises;


// PROCURANDO PELA PASTA VIEWS no VERCEL
root.set('views', path.join(__dirname, '..', 'views'));

const { deleteCard, editPost } = require('./controls/modify');

const { loginPage, autLogin, homePage, postPage, isAuthenticated } = require('./controls/users');

const { post_go_db} = require('./controls/newpost');
const { attjson } = require('./api/api');


//const encerrarSessao = require('./middles/encerraSessao');


root.get('/login', loginPage)
root.post('/login', autLogin)

//rotas protegidas
root.use(isAuthenticated)


root.get('/' ,homePage)
root.post('/' ,post_go_db)

root.get('/posts/', postPage)
root.post('/posts/', deleteCard)


root.get('/api/posts', async (req, res) => {
    try {
      const filePath = path.join(__dirname, './scratch/posts.json');
      const jsonData = await fs.readFile(filePath, 'utf8');
      const posts = JSON.parse(jsonData);
      res.json({ posts });
    } catch (error) {
      console.error('Erro ao ler o arquivo JSON:', error);
      res.status(500).json({ error: 'Erro ao obter dados da API.' });
    }
  });


root.get('/posts/update/:title/', (req, res) => {
    const title = req.params.title;
    res.render('pages/edit', { title });
});
root.use(attjson)
root.post('/posts/update/:title', editPost)










module.exports = root