const urlApi = 'https://db-pubs.vercel.app';
/*
const fetchAndCacheData = async () => {
  const cacheName = `data-cache-${Date.now()}`;

  try {
    // Limpar a cache existente
    await limparCache();

    // Abrir a nova cache
    const cache = await caches.open(cacheName);

    // Fetch para obter os dados da API
    const response = await fetch(urlApi);

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados - ${response.status}`);
    }

    // Converter a resposta em JSON
    const data = await response.json();

    // Armazenar a resposta da API na nova cache com um novo ETag
    await cache.put(new Request(urlApi), new Response(JSON.stringify(data), { headers: { 'ETag': response.headers.get('ETag') } }));

    console.log(`Dados da API armazenados em uma nova cache (${cacheName}) com sucesso.`);
    return data;
  } catch (error) {
    console.error('Erro ao buscar ou armazenar dados:', error.message);
    throw error;
  }
};

// Função para limpar a cache
const limparCache = async () => {
  try {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(async (cacheKey) => {
      if (cacheKey.includes('data-cache')) {
        await caches.delete(cacheKey);
        console.log(`Cache ${cacheKey} excluída com sucesso.`);
      }
    }));
  } catch (error) {
    console.error('Erro ao excluir o cache:', error);
  }
};


// Chama a função para buscar e armazenar dados
fetchAndCacheData();


const visualizarCache = async () => {
  try {
    const cache = await caches.open(`data-cache-${Date.now()}`);
    const keys = await cache.keys();

    console.log('Chaves na cache:');
    keys.forEach((key) => console.log(key.url));

    console.log('\nPosts na cache:');
    for (const key of keys) {
      const response = await cache.match(key);
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.error('Erro ao visualizar a cache:', error);
  }
};

// Chama a função para visualizar o cache
visualizarCache();
*/