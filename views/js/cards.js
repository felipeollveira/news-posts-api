const root = document.getElementById('root');

const fetchData = async () => {
    try {
      const response = await fetch('https://dark-gold-dog-yoke.cyclic.app');
  
      if (!response.ok) {
        throw new Error('Não foi possível obter os dados da API.');
      }
  
      const data = await response.json();
  
      if (data.posts.length !== 0) {
        for (const post of data.posts) {
          //let id = post.post_id;
          let titulo = post.titulo;
          //let assunto = post.assunto;
          let conclusao = post.conclusao;
          let data = post.data;
         // let autor = post.autor;
          //let introducao = post.introducao;

          const cards = document.createElement("div")
          cards.setAttribute('class', 'cards')
  
          let tituloElement = document.createElement("h5");
          tituloElement.setAttribute('class', 'cardtitle')
          tituloElement.textContent = titulo;

          let dataElement = document.createElement("h5");
          dataElement.textContent = "Data: " + data.substring(0,4);

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



          imgDelete.addEventListener("click", function() {
            let titulo = tituloElement.textContent;
            let btn = prompt('Deseja excluir? S/N');

            if (btn === 'S') {
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