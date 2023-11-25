const root = document.getElementById('root');

const fetchData = async () => {
    try {
      const response = await fetch('https://lovely-worm-tux.cyclic.app/api');
  
      if (!response.ok) {
        throw new Error('Não foi possível obter os dados da API.');
      }
  
      const data = await response.json();
  
      if (data.posts.length !== 0) {
        for (const post of data.posts) {
          let id = post.post_id;
          let titulo = post.titulo;
          let assunto = post.assunto;
          let conclusao = post.conclusao;
          let data = post.data;
          let autor = post.autor;
          let introducao = post.introducao;

          const cards = document.createElement("div")
          cards.setAttribute('class', 'cards')
  
          let tituloElement = document.createElement("h5");
          tituloElement.textContent = titulo;

          let dataElement = document.createElement("h5");
          dataElement.textContent = "Data: " + data.substring(0,4);

          // Adiciona os elementos ao elemento raiz
          cards.appendChild(tituloElement);
          cards.appendChild(dataElement)
          root.appendChild(cards);

          }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchData();
  