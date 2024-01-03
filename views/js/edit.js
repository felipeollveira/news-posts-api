const tituloInput = document.querySelector('input[name="titulo"]');
const introducaoTextarea = document.querySelector('textarea[name="introducao"]');
const assuntoTextarea = document.querySelector('textarea[name="assunto"]');
const conclusaoTextarea = document.querySelector('textarea[name="conclusao"]');

const obterTituloDaURL = () => {
    const urlSegments = window.location.pathname.split('/');
    const tituloEncoded = urlSegments[urlSegments.length - 1];

    if (tituloEncoded) {
        const tituloDecoded = decodeURIComponent(tituloEncoded);
        return tituloDecoded;
    }
    return '';
};

//const jr = require('./scratch/posts.json')


const buscarPostNaAPI = async (tituloDoPost) => {
    const apiUrl = 'https://db-pubs.vercel.app';
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Não foi possível obter os dados da API.');
      }
  
      const data = await response.json();
      const post = data.posts.posts.find(post => post.titulo === tituloDoPost);
  
      if (post) {
        preencherCamposDoFormulario(post);
      } else {
        console.log('Post não encontrado.');
      }
    } catch (error) {
      exibirErro('Erro ao buscar o post na API.');
      console.error(error);
    }
  };
  

const preencherCamposDoFormulario = (post) => {
    tituloInput.value = post.titulo;
    introducaoTextarea.value = post.introducao;
    assuntoTextarea.value = post.desenvolvimento;
    conclusaoTextarea.value = post.conclusao;
};

const exibirErro = (mensagem) => {

    console.error(mensagem);
   
    alert(mensagem);
};




const tituloDoPost = obterTituloDaURL();
buscarPostNaAPI(tituloDoPost);
