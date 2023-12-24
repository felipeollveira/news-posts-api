
require('dotenv').config();

const mongodbUri = process.env.MONGO_URI;
const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

const buscarTodosOsPosts = async () => {
  try {
    const uri = mongodbUri;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('publicacoes');
    const collection = database.collection('posts'); 
    const posts = await collection.find({}).toArray();

    client.close();

    return posts;
  } catch (error) {
    console.error('Erro ao buscar dados do MongoDB:', error.message);
    throw error;
  }
};

const criarArquivoJSON = async () => {
  try {
    const posts = await buscarTodosOsPosts();

    const jsonData = JSON.stringify(posts, null, 2);

    const diretorio = path.join(__dirname, '../scratch');
    const caminhoArquivo = path.join(diretorio, 'posts.json');

    // Verifica a existência do diretório
    await fs.access(diretorio).catch(async () => {
      // Se não existir, cria o diretório
      await fs.mkdir(diretorio, { recursive: true });
      console.log('Diretório criado com sucesso.');
    });

    // Escreve os dados no arquivo
    await fs.writeFile(caminhoArquivo, jsonData, 'utf8');
    console.log('Arquivo JSON criado com sucesso.');
  } catch (error) {
    console.error('Erro ao criar o arquivo JSON:', error.message);
    throw error;
  }
};

const attjson = async (req, res, next) => {
  try {
    criarArquivoJSON();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao criar o arquivo JSON.' });
  }
};


module.exports = {
  criarArquivoJSON,
  attjson
};

