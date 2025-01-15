const root = document.getElementById('root');
const apiUrl = 'https://db-pubs.vercel.app'; // A URL da API.

// Função para exibir a camada cinza (para carregamento ou mensagens)
const exibirCamadaCinza = (mensagem, corMensagem, opacidadeFundo) => {
  const camadaCinza = document.createElement('div');
  camadaCinza.className = 'camada-cinza';
  camadaCinza.style.position = 'fixed';
  camadaCinza.style.top = '0';
  camadaCinza.style.left = '0';
  camadaCinza.style.width = '100%';
  camadaCinza.style.height = '100%';
  camadaCinza.style.backgroundColor = `rgba(0, 0, 0, ${opacidadeFundo})`; 
  camadaCinza.style.zIndex = '9999';
  camadaCinza.style.display = 'flex';
  camadaCinza.style.alignItems = 'center';
  camadaCinza.style.justifyContent = 'center';

  const mensagemCarregando = document.createElement('p');
  mensagemCarregando.textContent = mensagem;
  mensagemCarregando.style.color = corMensagem;

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

// Função principal para buscar os dados da API
const fetchData = async () => {
  exibirCamadaCinza('Buscando posts...', 'white', '0.5'); 

  try {
   
      const response = await fetch(apiUrl);
      data = await response.json();
      localStorage.setItem('apiData', JSON.stringify(data));
    

    if (data.posts && data.posts.length > 0) {
      const usuarioLogado = user;  
      //console.log(data.posts)
      const postsDoUsuario = data.posts.filter(post => post.autor === usuarioLogado);

      if (postsDoUsuario.length > 0) {
        postsDoUsuario.forEach(post => {
          let titulo = post.titulo;
          let datapost = post.data;
          let idpost = post._id;

          const cards = document.createElement("div");
          cards.setAttribute('class', 'cards');
          
          let tituloElement = document.createElement("h5");
          tituloElement.setAttribute('class', 'cardtitle');
          tituloElement.textContent = titulo;
          tituloElement.setAttribute('data-id', idpost);

          let dataElement = document.createElement("h6");
          let dataDezChar = datapost.substring(0, 10);
          const dataCorreta = dataDezChar.split('-').reverse().join('/');
          dataElement.textContent = dataCorreta;

          let imgDelete = document.createElement('img');
          imgDelete.setAttribute('src', '/img/delete.png');
          imgDelete.setAttribute('id', 'iconDel');
          imgDelete.setAttribute('alt', 'Icone de excluir post');

          let imgModify = document.createElement('img');
          imgModify.setAttribute('src', '/img/modify.png');
          imgModify.setAttribute('alt', 'Icone de editar post');

          let titulos = document.createElement('section');
          titulos.setAttribute('class', 'titulos');

          let icons = document.createElement('section');
          icons.setAttribute('class', 'icons');

          titulos.appendChild(tituloElement);
          titulos.appendChild(dataElement);
          icons.appendChild(imgModify);
          icons.appendChild(imgDelete);

          cards.appendChild(titulos);
          cards.appendChild(icons);
          root.appendChild(cards);

          imgDelete.addEventListener("click", () => {
            popDel.style.display = 'grid';
            let id = tituloElement.dataset.id;
            let tituloSel = tituloElement.textContent;
            tituloSelecionado.textContent = tituloSel;
            let tituloMarcado = tituloSel;
            previaExclusao(tituloMarcado, id);
            window.prevExclusaoResult = previaExclusao(tituloMarcado, id);
          });

          function previaExclusao(tituloMarcado, id) {
            return { tituloMarcado, id };
          }

          window.handleExclusao = () => {
            const tituloDigitado = document.querySelector('input[name="tituloDigitado"]').value;

            if (tituloDigitado === '') {
              feedbackExclusao.textContent = 'Digite o titulo completo!';
              feedbackExclusao.style.display = 'grid';
            } else {
              const { tituloMarcado, id } = window.prevExclusaoResult;
              
              if (tituloDigitado === tituloMarcado) {
                if (user === 'convidado') {
                  feedbackExclusao.textContent = 'Você é um usuário convidado, não apresse as coisas rs';
                  feedbackExclusao.style.display = 'grid';
                  return 0;
                }
                timer("start");
                feedbackExclusao.style.display = 'none';
                loadingOverlay.style.display = 'flex';
                popExclusao.style.display = 'none';

                fetch('/posts/', {
                  method: 'POST',
                  body: JSON.stringify({ id }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                .then(response => {
                  if (response.ok) {
                    handleFechaExclusao();
                    location.reload();
                  } else {
                    throw new Error(`Erro ao excluir o post: ${response.statusText}`);
                  }
                  timer("end");
                })
                .catch(error => {
                  console.error(error);
                  loadingOverlay.style.display = 'none';
                  feedbackExclusao.textContent = 'Não foi possível fazer a exclusão';
                  feedbackExclusao.style.display = 'grid';
                  popExclusao.style.display = 'grid';
                });
              } else {
                feedbackExclusao.style.display = 'grid';
                feedbackExclusao.textContent = 'Título digitado não corresponde ao da publicação selecionada';
              }
            }
          };

          imgModify.addEventListener("click", () => {
            let titulocard = tituloElement.textContent;

            try {
              let titulocardEncoded = encodeURIComponent(titulocard);
              let url = `/posts/${titulocardEncoded}`;
              window.location.href = url;
            } catch (error) {
              console.log(error);
            }
          });
        });
      } else {
        exibirCamadaCinza('Nenhum post encontrado para o usuário logado! Faca seu primeiro post hoje :)', 'white', '0.95');
        setTimeout(() => {
          window.location.href = '/'
        }, 3000);
      }
    } else {
      setTimeout(() => {
        exibirCamadaCinza('Não há posts disponíveis', 'white', '0.95');
      }, 5500);
    }
  } catch (error) {
    exibirCamadaCinza('Erro interno no servidor', 'red', '0.95');
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } finally {
    removerCamadaCinza();
  }
};

fetchData();
