const { attVersion } = require('./version');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const MENSAGEM_EXCLUSAO_ERRO = 'Erro no servidor ao excluir documento.';

const sanitizeInput = (input) => input.replace(/</g, '&lt;'); // Simplificado

const connectToDatabase = async () => {  // Função reutilizável para conectar ao banco de dados
    try {
        await client.connect();
        return client.db('posts').collection('pubs');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error; // Repassa o erro para ser tratado pelo chamador
    }
};

const closeDatabaseConnection = async () => { // Função reutilizável para fechar a conexão
    try {
        await client.close();
    } catch (error) {
        console.error('Erro ao fechar a conexão com o banco de dados:', error);
    }
};

const deleteCard = async (req, res) => {
    const { id } = req.body;

    try {
        const pubCollection = await connectToDatabase();
        const result = await pubCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Nenhum documento encontrado para exclusão.' });
        }

        await attVersion();
        return res.status(200).redirect('/posts');

    } catch (error) {
        console.error('Erro ao excluir documento:', error);
        return res.status(500).json({ message: MENSAGEM_EXCLUSAO_ERRO });
    } finally {
        await closeDatabaseConnection();
    }
};


const editPost = async (req, res) => {
    const tituloSearch = req.params.title;
    const { titulo, introducao, assunto, conclusao, imagem } = req.body;

    if (!titulo) return res.status(401).redirect(`/posts/${tituloSearch}`);

    // Sanitização em um único objeto
    const sanitizedData = {
        titulo: sanitizeInput(titulo),
        introducao: sanitizeInput(introducao),
        desenvolvimento: sanitizeInput(assunto),
        conclusao: sanitizeInput(conclusao),
        imagem
    };



    try {
        const pubCollection = await connectToDatabase();

        const result = await pubCollection.findOneAndUpdate(
            { titulo: tituloSearch },
            { $set: sanitizedData }, // Usando o objeto sanitizado diretamente
            { returnDocument: 'after' } // Retorna o documento atualizado
        );

        if (result.value) { // Verifica se o documento foi encontrado e atualizado
            await attVersion();
            return res.status(200).redirect(`/posts/`);
        } else {
            return res.status(404).json({ mensagem: 'Post não encontrado ou não modificado.' });
        }

    } catch (error) {
        console.error('Erro ao editar o post:', error);
        return res.status(500).json({ mensagem: 'Erro ao editar o post.' });
    } finally {
        await closeDatabaseConnection();
    }
};



module.exports = { deleteCard, editPost };
