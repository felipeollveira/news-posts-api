
const knex = require('../sql/connect')
const bcrypt = require('bcrypt');



require('dotenv').config();


const loginPage = (req, res) => {
  if( req.session.logado === true) res.redirect('/home')
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
        return res.status(200).redirect('/new');
      } else {
        return res.redirect('/');
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
      return res.redirect('/');
    }
  };


  const postPage =  (req, res) => {
    if (req.session.logado) {
      res.render('pages/posts')
    } else {
      return res.redirect('/');
    }
  };


module.exports = {
    loginPage,
    autLogin,
    homePage,
    postPage

 }