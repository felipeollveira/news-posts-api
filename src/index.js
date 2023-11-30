const express = require('express');
const root = require('./rotas');
const session = require('express-session');
const server = express();
const cors = require('cors');
const { join } = require('path');
const sessionSecret = process.env.private_key






server.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));


server.use(express.static(__dirname + '/middles'));
server.use(express.static(__dirname + '/public'));
server.use(express.json())

server.use('/static', express.static(join("views")))

server.use(cors());
server.use(root) // rotas

// Iniciand o servidor
const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

console.log(`http://localhost:${PORT}/`)
