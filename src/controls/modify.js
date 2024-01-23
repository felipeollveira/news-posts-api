const { attVersion } = require('./version');
const Post = require('../sql/models/posts');



// Função para deletar um post via rota HTTP
const deleteCard = async (req, res, next) => {
  const { titulo } = req.body;

  try {
    const documento = await Post.findOne({ titulo: titulo });

    if (!documento) {
      return res.status(404).json({ message: 'Nenhum documento encontrado para exclusão.' });
    }
    const resultado = await documento.delete();
    await attVersion();

    return res.status(200).json({ message: 'Documento excluído com sucesso.' });
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

    const result = await Post.updateOne({ titulo: tituloSearch }, { $set: updateValues }).maxTimeMS(30000); 

    if (result.nModified > 0) {
      // A atualização ocorreu com sucesso, você pode realizar outras ações se necessário.
      await attVersion()

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
