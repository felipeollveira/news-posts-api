
const knex = require('../sql/connect')
const bcrypt = require('bcrypt');



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
    try {
      const login = req.body.login;
      const senha = req.body.senha;
  
      const user = await knex('users').where({ login: login }).first();
  
      if (user && (await bcrypt.compare(senha, user.password))) {
        req.session.logado = true;
        req.session.login = login;
        return res.status(200).redirect('/');
      } else {
        return res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
      return res.status(401);
    }
  };
  

const homePage =  (req, res) => {
    if (req.session.logado) {
      res.render('pages/home')
    } else {
      return res.redirect('/login');
    }
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