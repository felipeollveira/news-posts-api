const fs = require('fs').promises;
const fetch = require('node-fetch');
const path = require('path');

const urlAPI = 'https://dark-gold-dog-yoke.cyclic.app';

const buscarTodosOsPosts = async () => {
  try {
    const response = await fetch(urlAPI);

    if (!response.ok) {
      throw new Error('Não foi possível obter os dados da API.');
    }

    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const criarArquivoJSON = async () => {
  try {
    const posts = await buscarTodosOsPosts();

    const jsonData = JSON.stringify(posts, null, 2);

    const diretorio = path.join(__dirname, '../scratch');
    const caminhoArquivo = path.join(diretorio, 'posts.json');

    // Cria o diretório se não existir
    if(!diretorio){
      await fs.mkdir(diretorio, { recursive: true });
      console.log('Arquivo JSON criado com sucesso.');
    }
    // Escreve os dados no arquivo
    await fs.writeFile(caminhoArquivo, jsonData, 'utf8');
    
  } catch (error) {
    console.error('Erro ao criar o arquivo JSON:', error);
  }

};

const attjson = (req, res, next) => {

    criarArquivoJSON();

  next();
};

module.exports = {
  attjson
}
