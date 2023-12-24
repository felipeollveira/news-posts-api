const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { criarArquivoJSON } = require('../api/api');
const Post = require('../sql/models/posts');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Evento para deletar um post
  socket.on('deletePost', async (titulo) => {
    try {
      const resultado = await Post.deleteOne({ titulo: titulo });

      if (resultado.deletedCount > 0) {
        io.emit('postDeleted'); // Emitir evento WebSocket
        criarArquivoJSON();
      } else {
        console.log('Nenhum documento encontrado para exclusão.');
      }
    } catch (error) {
      console.error('Erro no servidor ao excluir documento:', error);
    }
  });
});

// Função para deletar um post via rota HTTP
const deleteCard = async (req, res, next) => {
  const { titulo } = req.body;

  try {
    const resultado = await Post.deleteOne({ titulo: titulo });

    if (resultado.deletedCount > 0) {
      criarArquivoJSON();
      return res.status(200).json({ message: 'Documento excluído com sucesso.' });
    } else {
      return res.status(404).json({ message: 'Nenhum documento encontrado para exclusão.' });
    }
  } catch (error) {
    console.error('Erro no servidor ao excluir documento:', error);
    return res.status(500).json({ message: 'Erro no servidor ao excluir documento.' });
  }
};

// Função para editar um post
const editPost = async (req, res) => {
  const tituloSearch = req.params.title;
  const { titulo, introducao, assunto, conclusao } = req.body;

  try {
    const updateValues = {};
    if (titulo) updateValues.titulo = titulo;
    if (introducao) updateValues.introducao = introducao;
    if (assunto) updateValues.desenvolvimento = assunto;
    if (conclusao) updateValues.conclusao = conclusao;

    if (Object.keys(updateValues).length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum valor foi fornecido para atualização.' });
    }

    const result = await Post.updateOne({ titulo: tituloSearch }, { $set: updateValues });

    if (result.nModified > 0) {
      criarArquivoJSON();
      return res.status(200).json({ mensagem: 'Post atualizado com sucesso.' });
    } else {
      console.error('Nenhuma linha foi atualizada.');
      return res.status(404).json({ mensagem: 'Post não encontrado ou não foi modificado.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao editar o post.' });
  }
};

module.exports = {
  deleteCard,
  editPost
};
