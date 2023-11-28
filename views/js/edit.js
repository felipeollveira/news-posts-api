const tituloInput = document.querySelector('input[name="titulo"]');
const introducaoTextarea = document.querySelector('textarea[name="introducao"]');
const assuntoTextarea = document.querySelector('textarea[name="assunto"]');
const conclusaoTextarea = document.querySelector('textarea[name="conclusao"]');

const obterTituloDaURL = () => {
    const currentURL = window.location.href;
    const tituloIndex = currentURL.indexOf('edit/');

    if (tituloIndex !== -1) {
        const tituloPart = currentURL.substring(tituloIndex + 5);
        const tituloDecoded = decodeURIComponent(tituloPart.replace(/%20/g, ' '));
        return tituloDecoded;
    }

    return '';
};

const buscarPostNaAPI = async (tituloDoPost) => {
    try {
        const response = await fetch('https://lovely-worm-tux.cyclic.app/api');
        if (!response.ok) {
            throw new Error('Não foi possível obter os dados da API.');
        }

        const data = await response.json();
        const post = data.posts.find(post => post.titulo === tituloDoPost);

        if (post) {
            tituloInput.value = post.titulo;
            introducaoTextarea.value = post.introducao;
            assuntoTextarea.value = post.desenvolvimento;
            conclusaoTextarea.value = post.conclusao;
        } else {
            console.log('Post não encontrado.');
        }
    } catch (error) {
        console.error(error);
    }
};

const tituloDoPost = obterTituloDaURL();
buscarPostNaAPI(tituloDoPost);
