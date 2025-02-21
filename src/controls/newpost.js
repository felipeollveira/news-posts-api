const { MongoClient } = require('mongodb');
const { attVersion } = require('./version');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const sanitizeInput = (input) => input.replace(/</g, '&lt;');

const connectToDatabase = async () => {
    try {
        await client.connect();
        return client.db('posts').collection('pubs');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
};

const closeDatabaseConnection = async () => {
    try {
        await client.close();
    } catch (error) {
        console.error('Erro ao fechar a conexão com o banco de dados:', error);
    }
};


const post_go_db = async (req, res) => {
    const { titulo, introducao, assunto, conclusao, imagem, user } = req.body;

    if (!titulo) return res.status(400).redirect('/'); // Bad Request 400

    if (user !== 'convidado') { // Usar !== para comparação estrita

        const sanitizedData = { // Sanitização em um único objeto
            titulo: sanitizeInput(titulo),
            introducao: sanitizeInput(introducao),
            desenvolvimento: sanitizeInput(assunto),
            conclusao: sanitizeInput(conclusao),
            imagem,
            data: new Date(),
            autor: process.env.AUTOR || user
        };

        try {
            const pubCollection = await connectToDatabase();
            await pubCollection.insertOne(sanitizedData);
            await attVersion();
            res.redirect('/'); // 200 OK implícito no redirect
        } catch (error) {
            console.error('Erro ao criar o post:', error);
            return res.status(500).json({ message: 'Erro no servidor', error: error.message }); // Retornar JSON em caso de erro
        } finally {
            await closeDatabaseConnection();
        }
    } else {
        // Lidar com o caso em que o usuário é 'convidado' (talvez redirecionar ou exibir uma mensagem)
        return res.status(403).redirect('/'); // Forbidden 403, se não for permitido postar como convidado
    }
};

module.exports = { post_go_db };
