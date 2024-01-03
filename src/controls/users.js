const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


const isAuthenticated = (req, res, next) => {
  console.log('Middleware isAuthenticated acionado');
  const token = req.cookies.jwt; // Assumindo que o token está armazenado em um cookie chamado "jwt"

  if (token) {
    jwt.verify(token, process.env.private_key, (err, decoded) => {
      if (err) {
        console.error('Erro na verificação do token:', err);
        res.clearCookie('jwt'); // Limpar o cookie para evitar loops persistentes
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/');
  }
};



const loginPage = (req, res) => {
  if (req.cookies.jwt) res.redirect('/');
  else res.render('pages/login');
};


const autLogin = async (req, res) => {
  const { login, senha } = req.body;

  try {
    await client.connect();

    if (!login || !senha) {
      return res.status(400).send('Credenciais incompletas');
    }

    const usersCollection = client.db('posts').collection('admins');
    const user = await usersCollection.findOne({ name: login });

    if (user && (await bcrypt.compare(senha, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.private_key, { expiresIn: '1h', algorithm: 'HS256' });


      res.cookie('jwt', token, { httpOnly: true, maxAge: 600 * 1000 });
      
      res.status(200).redirect('/');
    } else {
      return res.status(401).send('Falha na autenticação');
    }
  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    return res.status(500).send('Falha na autenticação');
  } finally {
    await client.close();
  }
};

const homePage = (req, res) => {
  res.render('pages/home');
};

const postPage = (req, res) => {
  res.render('pages/posts');
};

module.exports = {
  loginPage,
  autLogin,
  homePage,
  postPage,
  isAuthenticated,
};
