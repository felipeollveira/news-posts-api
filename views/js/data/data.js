const urlApi = 'https://db-pubs.vercel.app';

// Função para obter dados da API
async function fetchDataFromApi() {
  try {
    const response = await fetch(urlApi);
    const data = await response.json();
    localStorage.setItem('apiData', JSON.stringify(data));
    //console.log('Dados da API armazenados na cache do navegador.');
  } catch (error) {
    console.error('Erro ao obter dados da API:', error);
  }
}

fetchDataFromApi();
