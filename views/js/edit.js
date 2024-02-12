

const tituloInput = document.querySelector('input[name="titulo"]');
const introducaoTextarea = document.querySelector('textarea[name="introducao"]');
const assuntoTextarea = document.querySelector('textarea[name="assunto"]');
const conclusaoTextarea = document.querySelector('textarea[name="conclusao"]');
const imagemTextareaSecond = document.querySelector('textarea[name="image"]')
const visualizarImagem = document.getElementById('imagemAtual')

const obterTituloDaURL = () => {
    const urlSegments = window.location.pathname.split('/');
    const tituloEncoded = urlSegments[urlSegments.length - 1];

    if (tituloEncoded) {
        const tituloDecoded = decodeURIComponent(tituloEncoded);
        return tituloDecoded;
    }
    return '';
};

// Função para exibir a camada cinza
const exibirCamadaCinza = (mensagem, cor, opacity) => {
  const camadaCinza = document.createElement('div');
  camadaCinza.className = 'camada-cinza';
  camadaCinza.style.position = 'fixed';
  camadaCinza.style.top = '0';
  camadaCinza.style.left = '0';
  camadaCinza.style.width = '100%';
  camadaCinza.style.height = '100%';
  camadaCinza.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`; 
  camadaCinza.style.zIndex = '1';
  camadaCinza.style.display = 'flex';
  camadaCinza.style.alignItems = 'center';
  camadaCinza.style.justifyContent = 'center';

  const mensagemCarregando = document.createElement('p');
  mensagemCarregando.textContent = mensagem;
  mensagemCarregando.style.color = cor;

  camadaCinza.appendChild(mensagemCarregando);

  document.body.appendChild(camadaCinza);
};

// Função para remover a camada cinza
const removerCamadaCinza = () => {
  const camadaCinza = document.querySelector('.camada-cinza');
  if (camadaCinza) {
      document.body.removeChild(camadaCinza);
  }
};

const buscarPostNaAPI = async (tituloDoPost) => {
  exibirCamadaCinza('','white','0.5'); 

  const apiUrl = 'https://db-pubs.vercel.app';

  try {
    const cachedResponse = localStorage.getItem('apiData');
    let data = cachedResponse ? JSON.parse(cachedResponse) : null;

    if (!data) {
      // Se os dados não estiverem na cache, buscar da API e armazenar
      const response = await fetch(apiUrl);
      data = await response.json();
      
      localStorage.setItem('apiData', JSON.stringify(data));
    }

      const post = data.posts.find(post => post.titulo === tituloDoPost);

      if (post) {
          preencherCamposDoFormulario(post);
      } else {            
        exibirCamadaCinza('Erro inesperado ao buscar post','red','0.95');
       
        setTimeout(() => {
          window.location.href = '/posts';
        }, 1000);
      }
  } catch (error) {
      exibirErro('Erro ao buscar o post na API.');
      console.error(error);
  } finally {
      removerCamadaCinza(); 
  }
};


const preencherCamposDoFormulario = (post) => {
    tituloInput.value = post.titulo;
    introducaoTextarea.value = post.introducao;
    assuntoTextarea.value = post.desenvolvimento;
    conclusaoTextarea.value = post.conclusao;
    visualizarImagem.src = post.imagem


    if(post.imagem === null || post.imagem === "")  {
     visualizarImagem.style.display ='none'
     btnUpload.style.display ='block'
     btnSubstituir.style.display ='none'
 
  }else{ 
    imagemTextareaSecond.value = imagemAtual.src
  }

  
    

};

const exibirErro = (mensagem) => {

    console.error(mensagem);
   
    alert(mensagem);
};

//evento de enter
function handleKeyDown(event) {
  if (event.key === 'Enter') {
      // Verifica qual elemento foi acionado e chama a função correspondente
      switch (event.target.id) {
          case 'verificarImagem':
              verificarImagem();
              break;
          case 'fecharModal':
              fecharModal();
              break;
          case 'salvar':
              salvar();
              break;
          case 'escolherOutra':
              escolherOutra();
              break;
          default:
              break;
      }
  }
}




const tituloDoPost = obterTituloDaURL();
buscarPostNaAPI(tituloDoPost);
