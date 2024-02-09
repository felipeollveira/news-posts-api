const express = require('express');
const root = require('./rotas');
const session = require('express-session');
const server = express();
const cors = require('cors');
const { join } = require('path');


const sessionSecret = process.env.private_key
const cookieParser = require('cookie-parser');
const { run } = require('./sql/connect');



server.use(cookieParser());

server.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));


server.use(express.static(__dirname + '/middles'));
server.use(express.static(__dirname + '/public'));
server.use(express.json())

server.use('/static', express.static(join("views/")))

server.use(cors());
server.use(root) // rotas

// Iniciand o servidor
const PORT = process.env.PORT || 3000; 

/*
run().then(() => {
  server.listen(3000, () => {
    console.log(`Servidor Express iniciado na porta ${PORT}`); 
    
  });
}).catch(console.dir);

*/



  server.listen(3000, () => {
    console.log(`Servidor Express iniciado na porta ${PORT}`); 
    
  });
