
const {client} = require('../sql/connect')
const bcrypt = require('bcrypt');
const Post = require('../sql/models/posts')



require('dotenv').config();

const isAuthenticated = (req, res, next) => {
  if (req.session.logado) {
    next();
  } else {
    res.redirect('/login');
  }
};


const loginPage = (req, res) => {
  if( req.session.logado === true) res.redirect('/')
  else{
      res.render('pages/login')

    };
  }


  const autLogin = async (req, res) => {
    const { login, senha } = req.body;
  
    try {
      // Validar entradas
      if (!login || !senha) {
        return res.status(400).send('Credenciais incompletas');
      }

      const db = client.db('posts');
      const collection = db.collection('admins');

      const user = await collection.findOne({ name: login });
  
      if (user && (await bcrypt.compare(senha, user.password))) {
        req.session.logado = true;
        req.session.login = login;

        await client.close();
  
        return res.status(200).redirect('/');
      } else {
        return res.status(401).send('Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro durante a autenticação:', error);
  
      return res.status(500).send('Falha na autenticação');
    }
  };
  
  

const homePage =  (req, res) => {
    res.render('pages/home')
  };

 
  const postPage =  (req, res) => {
    res.render('pages/posts')
      
  };


module.exports = {
    loginPage,
    autLogin,
    homePage,
    postPage,
    isAuthenticated

 }