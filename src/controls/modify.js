const knex = require('../sql/connect')

const obterTituloDaURL = () => {
    const currentURL = window.location.href;
    const tituloIndex = currentURL.indexOf('=');

    if (tituloIndex !== -1) {
        const tituloPart = currentURL.substring(tituloIndex + 1);
        const tituloDecoded = decodeURIComponent(tituloPart.replace(/%20/g, ' '));
        return tituloDecoded;
    }
    
    return ''; }

const deleteCard = async (req, res) => {
    const { titulo } = req.body;
    console.log(titulo)
    try {
        await knex('post').where('titulo', titulo).del();

        return res.status(200)
    } catch (error) {
        console.error(error);
        return res.status(500)
    }
};

const editPage = (req, res) => {
    try {
        res.render('pages/edit');
    } catch (error) {
        console.log(error)
        res.render('pages/home');
    }
}

const editPost = async (req, res) => {
    const { titulo, introducao, assunto, conclusao } = req.body;
    console.log

    try {
        const existingPost = await knex('post').where('titulo', titulo).first();

        if (!existingPost) {
            return res.status(404).json({ mensagem: 'Post não encontrado.' });
        }

        const result = await knex('post')
            .where('titulo', titulo)
            .update({
                titulo,
                introducao,
                desenvolvimento: assunto,
                conclusao,
            });

        if (result > 0) {
            return res.status(200).json({ mensagem: 'Post editado com sucesso!' });
        } else {
            console.error('Nenhuma linha foi atualizada.');
            return res.status(404).json({ mensagem: 'Post não encontrado ou não foi modificado.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao editar o post.' });
    }
};




module.exports = {
    deleteCard,
    editPage,
    editPost
}
