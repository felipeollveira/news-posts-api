const root = document.getElementById('root');
const apiUrl =  'https://db-pubs.vercel.app';



const fetchData = async () => {
    try {

      const cachedResponse = await fetch(apiUrl);
      let data = cachedResponse ? await cachedResponse.json() : null;
      
  

      if (data.posts.length !== 0) {
        for (const post of data.posts.posts) {
          let titulo = post.titulo;
          let datapost = post.data;


          const cards = document.createElement("div")
          cards.setAttribute('class', 'cards')
  
          let tituloElement = document.createElement("h5");
          tituloElement.setAttribute('class', 'cardtitle')
          tituloElement.textContent = titulo;

          let dataElement = document.createElement("h5");
          dataElement.textContent = "Data: " + datapost.substring(0,4);

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



          const confirmarExclusao = () => {
            const titulo = tituloElement.textContent;
            const confirmacao = prompt('Digite a primeira letra do titulo para excluir');
            return { titulo, confirmacao };
          };
          
          const handleExclusao = ({ titulo, confirmacao }) => {
            if (confirmacao === titulo[0]) {
              fetch('/posts/', {
                method: 'POST',
                body: JSON.stringify({ titulo }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then(response => {
                if (response.ok) {
                  alert('Post excluído com sucesso');
                } else {
                  console.error('Erro ao enviar a solicitação: ', response.status);
                }
              })
              .catch(error => {
                console.error('Erro ao enviar a solicitação: ', error);
              });
            } else {
              alert('Exclusão cancelada');
            }
          };
          
          imgDelete.addEventListener("click", function() {
            const confirmacaoData = confirmarExclusao();
            handleExclusao(confirmacaoData);
          });
          


            imgModify.addEventListener("click", function() {
            let titulocard = tituloElement.textContent;
            
            try {
                let titulocardEncoded = encodeURIComponent(titulocard);
                let url = `/posts/update/${titulocardEncoded}`;
        
                window.location.href = url;
            
            } catch (error) {
                console.log(error);
            }
        });
        
       
      
    }
} else {
    console.log('Não ha posts disponíveis');
}
} catch (error) {
console.error(error);
}
};


fetchData();
