const { attVersion } = require('./version');
const Post = require('../sql/models/posts');



// Função para deletar um post via rota HTTP
const deleteCard = async (req, res, next) => {
  const { id } = req.body;
  
  try {
    const documento = await Post.findOne({ _id: id });

    if (!documento) {
      return res.status(404).json({ message: 'Nenhum documento encontrado para exclusão.' });
    }

     await documento.deleteOne();
    await attVersion();

    return res.status(200).json({ message: MENSAGEM_EXCLUSAO_SUCESSO });
  } catch (error) {
    console.error('Erro no servidor ao excluir documento:', error);
    return res.status(500).json({ message: MENSAGEM_EXCLUSAO_ERRO });
  }
};


const MENSAGEM_EXCLUSAO_SUCESSO = 'Documento excluído com sucesso.';
const MENSAGEM_EXCLUSAO_ERRO = 'Erro no servidor ao excluir documento.';



// Função para editar um post
const editPost = async (req, res) => {
  const tituloSearch = req.params.title;
  const { id, titulo, introducao, assunto, conclusao } = req.body;

  try {
    const updateValues = {
      titulo: titulo || undefined,
      introducao: introducao || undefined,
      desenvolvimento: assunto || undefined,
      conclusao: conclusao || undefined
    };

    const hasUpdateValues = Object.values(updateValues).some(value => value !== undefined);

    if (!hasUpdateValues) {
      return res.status(400).json({ mensagem: 'Nenhum valor foi fornecido para atualização.' });
    }

    const result = await Post.updateOne({ titulo: tituloSearch }, { $set: updateValues }).maxTimeMS(30000);

    if (result.nModified > 0) {
      await attVersion();
      return res.status(200).json({ mensagem: MENSAGEM_EDITADO_SUCESSO });
    } else {
      console.error('Nenhuma linha foi atualizada.');
      return res.status(404).json({ mensagem: 'Post não encontrado ou não foi modificado.' });
    }
  } catch (error) {
    console.error('Erro ao editar o post:', error);
    return res.status(500).json({ mensagem: MENSAGEM_EDITADO_ERRO });
  }
};

const MENSAGEM_EDITADO_SUCESSO = 'Post atualizado com sucesso.';
const MENSAGEM_EDITADO_ERRO = 'Erro ao editar o post.';



module.exports = {
  deleteCard,
  editPost
};
