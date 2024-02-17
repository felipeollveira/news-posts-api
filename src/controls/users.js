const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const generateAuthToken = (userId, expiresIn = '1h') => {
  return jwt.sign({ userId }, process.env.private_key, { expiresIn, algorithm: 'HS256' });
};

const loginPage = (req, res) => {
  if (req.cookies.jwt) res.redirect('/');
  else res.render('pages/login');
};

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.private_key, (err, decoded) => {
      if(loginType === '') res.clearCookie('jwt');
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.error('Token expirado:', err);
          res.clearCookie('jwt');
          return res.redirect('/login');
        } else {
          console.error('Erro na verificação do token:', err);
          res.clearCookie('jwt');
          return res.redirect('/login');
        }
      } else {
        // Adicione o nome de usuário à sessão
        req.session.userName = loginType;

        // Verifique se o ID do usuário no token corresponde ao ID do usuário atual
        const userIdFromToken = decoded.id;
        const userIdFromRequest = req.params.user; // ou de onde quer que venha o ID do usuário na sua aplicação

        if (userIdFromToken === userIdFromRequest) {
          // O ID do usuário no token corresponde ao ID do usuário atual
          return next();
        } else {
          // O ID do usuário no token não corresponde ao ID do usuário atual
          console.error('ID do usuário no token não corresponde ao ID do usuário atual');
          return res.redirect('/login');
        }
      }
    });
  } else {
    return res.redirect('/login');
  }
};



let loginType = '';

const tipoLogin = (login) => {
  loginType = login;
}

const autLogin = async (req, res) => {
  const { login, senha } = req.body;
  
  try {
    await client.connect();

    if (!login || !senha) {
      return res.status(400).send('Credenciais incompletas');
    }

    tipoLogin(login);

    const usersCollection = client.db('posts').collection('admins');
    const user = await usersCollection.findOne({ name: login });

    if (user && (await bcrypt.compare(senha, user.password))) {
      const token = generateAuthToken(user._id);
     
      res.cookie('jwt', token, { httpOnly: true, maxAge: 600 * 1000 });

      return res.status(200).redirect(`/`);
    } else {
      return res.status(401);
    }

  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    return res.status(500).send('Falha na autenticação');
  } finally {
    await client.close();
  }
};

const homePage = (req, res) => {
  //res.clearCookie('jwt');
 //console.log(req.session.userName);

  res.render('pages/home', { user: req.session.userName });
};

 
const postPage = (req, res) => {
  //const key = process.env.CHAVE_SECRETA
  res.render('pages/posts', { user: req.session.userName });
};



module.exports = {
  loginPage,
  autLogin,
  homePage,
  postPage,
  isAuthenticated,
  tipoLogin,

};
