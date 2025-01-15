const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const loginPage = (req, res) => {
  if (req.cookies.jwt) res.redirect('/');
  else res.render('pages/login');
};

const generateAuthToken = (login, expiresIn = '1h') => {
  return jwt.sign({ login }, process.env.private_key, { expiresIn, algorithm: 'HS256' });
};

const tipoLogin = (req) => {
  const token = req.cookies.jwt;

  if (token) {
    const decodedToken = jwt.verify(token, process.env.private_key);
    return decodedToken.login;
  } else {
    return null; 
  }
};

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.private_key, (err, decoded) => {
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
        const userIdFromToken = decoded.id;
        const userIdFromRequest = req.params.user;

        if (userIdFromToken === userIdFromRequest) {
          return next();
        } else {
          console.error('ID do usuário no token não corresponde ao ID do usuário atual');
          return res.redirect('/login');
        }
      }
    });
  } else {
    return res.status(401).redirect('/login');
  }
};

const deslogar = (req, res) => {
  // Limpa o cookie de autenticação ('jwt')
  res.clearCookie('jwt', {
    httpOnly: true,  // Não acessível via JavaScript
    secure: process.env.NODE_ENV === 'production', // Só envia cookies via HTTPS em produção
    sameSite: 'Strict', // Pode ser 'Lax' ou 'None' dependendo do seu fluxo de autenticação
  });

  // Após limpar o cookie, redireciona o usuário para a página inicial ou envia uma resposta de sucesso
  return res.status(200).redirect('/'); // Ou pode ser: res.send('Logout realizado com sucesso');
};

const autLogin = async (req, res) => {
  const { login, senha } = req.body;

  // Input validation
  if (!login || !senha) {
    return res.status(400).send('Credenciais incompletas');
  }

  try {
    await client.connect();

    // Handle special login for "convidado"
    if (login === 'convidado' && senha === 'senhasegura') {
      const token = generateAuthToken(login);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 600 * 1000, // 10 minutos
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
      });
      return res.status(200).redirect('/');
    }

    // Handle regular user login
    const usersCollection = client.db('users').collection('passwords');
    const user = await usersCollection.findOne({ name: login });

    if (user && await bcrypt.compare(senha, user.password)) {
      const token = generateAuthToken(user.name);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 600 * 1000, // 10 minutos
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
      });
      
      return res.status(200).redirect('/');
    }

    // If credentials are incorrect
    return res.status(401).send('Credenciais inválidas');

  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    return res.status(500).redirect('/');
  } finally {
    await client.close();
  }
};



const homePage = (req, res) => {
  //res.clearCookie('jwt');
 const login = tipoLogin(req);
  res.render('pages/home', { user: login });
};

 
const postPage = (req, res) => {
  const login = tipoLogin(req);
  res.render('pages/posts', { user: login });
};




module.exports = {
  loginPage,
  autLogin,
  homePage,
  postPage,
  isAuthenticated,
  tipoLogin,
  deslogar

};
