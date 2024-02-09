const root = document.getElementById('root');
const apiUrl =  'https://db-pubs.vercel.app';

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

const fetchData = async () => {
  exibirCamadaCinza('Buscando posts...','white','0.5'); 
    try {

      const apiUrl = 'https://db-pubs.vercel.app';
        const cachedResponse = localStorage.getItem('apiData');
        let data = cachedResponse ? JSON.parse(cachedResponse) : null;

       
    
        if (!data) {
          // Se os dados não estiverem na cache, buscar da API e armazenar
          const response = await fetch(apiUrl);
          data = await response.json();
          localStorage.setItem('apiData', JSON.stringify(data));
        }
        
      if (data.posts.length !== 0) {
        for (const post of data.posts) {
          let titulo = post.titulo;
          let datapost = post.data;
          let idpost = post._id

      

          const cards = document.createElement("div")
          cards.setAttribute('class', 'cards')
  
          let tituloElement = document.createElement("h5");
          tituloElement.setAttribute('class', 'cardtitle')
          tituloElement.textContent = titulo;
          tituloElement.setAttribute('data-id', idpost)

          let dataElement = document.createElement("h6");
          let dataDezChar = datapost.substring(0,10);
          const dataCorreta = dataDezChar.split('-').reverse().join('/');
          dataElement.textContent = dataCorreta


          let imgDelete = document.createElement('img')
          imgDelete.setAttribute('src','/img/delete.png')

          let imgModify = document.createElement('img')
          imgModify.setAttribute('src','/img/modify.png')

          let titulos = document.createElement('section')
          titulos.setAttribute('class', 'titulos')

          let icons = document.createElement('section')
          icons.setAttribute('class', 'icons')


          // Adiciona os elementos ao elemento raiz
          titulos.appendChild(tituloElement);
          titulos.appendChild(dataElement);
          icons.appendChild(imgModify);
          icons.appendChild(imgDelete);

          cards.appendChild(titulos);
          cards.appendChild(icons);
          root.appendChild(cards)

          
         

          function previaExclusao(tituloSelecionado, id){
            return {tituloSelecionado, id}
          }

          
          imgDelete.addEventListener("click", function() {
            popDel.style.display ='grid'

            let id = tituloElement.dataset.id
            tituloSelecionado.textContent = tituloElement.innerHTML;

  
            previaExclusao(tituloSelecionado, id);
          });


          function handleExclusao(){
            const tituloDigitado = document.querySelector('input[name="tituloDigitado"]').value;
            const { tituloSelecionado, id } = previaExclusao()

            if (tituloDigitado === tituloSelecionado) {
              fetch('/posts/', {
                method: 'POST',
                body: JSON.stringify({ id }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then(response => {
                 location.reload() 
                if (response.ok) {
                    alert('Post excluído com sucesso');   
                    handleFechaExclusao()
                } else {
                  console.error('Erro ao enviar a solicitação: ', response.status);
                }
              })
              .catch(error => {
                console.error('Erro ao enviar a solicitação: ', error);
              })
              .finally(() => {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            });
            } else {
              alert('Exclusão cancelada');
            }
          };
          
          

            imgModify.addEventListener("click", function() {
            let titulocard = tituloElement.textContent;
            
            try {
                let titulocardEncoded = encodeURIComponent(titulocard);
                let url = `/posts/${titulocardEncoded}`;
        
                window.location.href = url;
            
            } catch (error) {
                console.log(error);
            }
        });
        
       
      
    }
} else {
  setTimeout(() => {
    exibirCamadaCinza('Não há posts disponiveís','white','0.95');
  }, 5500);
}

} catch (error) {
  exibirCamadaCinza('Erro interno no servidor','red','0.95');
       
  setTimeout(() => {
    window.location.href = '/';
  }, 3000);
}
finally{
  removerCamadaCinza(); 
}
};


fetchData();


