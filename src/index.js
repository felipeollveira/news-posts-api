const express = require('express');
const root = require('./rotas');
const session = require('express-session');
const server = express();
const cors = require('cors');
server.use(session({ secret: process.env.private_key, resave: true, saveUninitialized: true }));


server.use(express.static(__dirname + '/middles'));
server.use(express.static(__dirname + '/public'));
server.use(express.json())

server.use(cors());
server.use(root) // rotas

// Iniciand o servidor
const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});

console.log(`http://localhost:${PORT}/`)
