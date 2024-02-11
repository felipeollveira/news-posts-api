const { attVersion } = require('./version');
const Post = require('../sql/models/posts');

const { MongoClient, ObjectId  } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


// Função para deletar um post via rota HTTP
const deleteCard = async (req, res, next) => {
  const { id } = req.body;

  try {

      await client.connect();

      const db = client.db('posts');
      const pubCollection = db.collection('pubs');

      const documento = await pubCollection.findOneAndDelete({ _id: new ObjectId(id) });

      if (!documento) {
          return res.status(404).json({ message: 'Nenhum documento encontrado para exclusão.' });
      }else{
        await attVersion();

      return res.status(200).redirect('/posts')
      }

      
  } catch (error) {
      console.error('Erro no servidor ao excluir documento:', error);
      return res.status(500).json({ message: MENSAGEM_EXCLUSAO_ERRO });
  } finally {
      try {
          await client.close();
      } catch (error) {
          console.error('Erro ao fechar a conexão com o banco de dados:', error);
      }
  }
};



const MENSAGEM_EXCLUSAO_ERRO = 'Erro no servidor ao excluir documento.';

function sanitizeInput(input) {

    const sanitizedInput = input
    .replace(/</g, '&lt;') 
  
    return sanitizedInput;
  }


const editPost = async (req, res) => {
    const tituloSearch = req.params.title;
    const { titulo, introducao, assunto, conclusao, imagem } = req.body;

    if(!titulo) return res.status(401).redirect(`/posts/${tituloSearch}`)

    const tituloSanitized = sanitizeInput(titulo);
    const introducaoSanitized = sanitizeInput(introducao);
    const assuntoSanitized = sanitizeInput(assunto);
    const conclusaoSanitized = sanitizeInput(conclusao);



    try {
        await client.connect();

        const db = client.db('posts');
        const pubCollection = db.collection('pubs');

        const updateValues = {
            $set: {
                titulo: tituloSanitized || undefined,
                introducao: introducaoSanitized || undefined,
                desenvolvimento: assuntoSanitized || undefined,
                conclusao: conclusaoSanitized || undefined,
                imagem: imagem || undefined
            }
        };

        const result = await pubCollection.findOneAndUpdate({ titulo: tituloSearch }, updateValues, { returnOriginal: false });

        if (result) {
            await attVersion();
            return res.status(200).redirect(`/posts/`);
   
        } else {
            console.error('Nenhuma linha foi atualizada.');
            return res.status(404).json({ mensagem: 'Post não encontrado ou não foi modificado.' });
        }
    } catch (error) {
        console.error('Erro ao editar o post:', error);
        return res.status(500).json({ mensagem: 'Erro ao editar o post.' });
    } finally {
        try {
            await client.close();
        } catch (error) {
            console.error('Erro ao fechar a conexão com o banco de dados:', error);
        }
    }
};







module.exports = {
  deleteCard,
  editPost
};
