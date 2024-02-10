const { MongoClient } = require('mongodb');
const Post = require('../sql/models/posts');

const { attVersion } = require('./version');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


function sanitizeInput(input) {

    const sanitizedInput = input
    .replace(/</g, '&lt;') 
  
    return sanitizedInput;
  }

const post_go_db = async (req, res, next) => {
    const { titulo, introducao, assunto, conclusao, imagem } = req.body;

    if(!titulo) return res.status(404).redirect('/')

    const tituloSanitized = sanitizeInput(titulo);
    const introducaoSanitized = sanitizeInput(introducao);
    const assuntoSanitized = sanitizeInput(assunto);
    const conclusaoSanitized = sanitizeInput(conclusao);

    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'UTC' });

    const autor = process.env.AUTOR || 'felipeoliveira';

    try {
        await client.connect();

        const pubCollection = client.db('posts').collection('pubs');

        const result = await pubCollection.insertOne({
            titulo: tituloSanitized,
            introducao: introducaoSanitized || undefined,
            desenvolvimento: assuntoSanitized || undefined,
            conclusao: conclusaoSanitized || undefined,
            imagem: imagem || undefined,
            data: timestamp,
            autor,
        });

        await attVersion()
        res.status(200).redirect('/');

    } catch (error) {
        console.error('Erro na criação do post:', error);
        return res.status(500).send({ message: 'Erro no servidor', error: error.message });
    } finally {
        try {
            await client.close();
        } catch (error) {
            console.error('Erro ao fechar a conexão com o banco de dados:', error);
        }
    }
};






module.exports = {
    post_go_db,
};
