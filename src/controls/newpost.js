const { MongoClient } = require('mongodb');
const Post = require('../sql/models/posts');

const { attVersion } = require('./version');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const post_go_db = async (req, res, next) => {
    const { titulo, introducao, assunto, conclusao, images } = req.body;
    const timestamp = new Date().toISOString();
    const autor = process.env.AUTOR || 'felipeoliveira';

    try {
        await client.connect();

        const pubCollection = client.db('posts').collection('pubs');

        /*
        console.log('Dados a serem inseridos:', {
            titulo,
            introducao,
            desenvolvimento: assunto,
            conclusao,
            data: timestamp,
            autor,
            images,
        });
        */
        // Operação de inserção diretamente na coleção
        const result = await pubCollection.insertOne({
            titulo,
            introducao,
            desenvolvimento: assunto,
            conclusao,
            data: timestamp,
            autor,
            images,
        });

        //console.log('Novo post criado com imagens:', images);
        await attVersion()
        res.status(204).send({ message: 'Publicado!' });
        next();
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
