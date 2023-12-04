const knex = require('../sql/connect')




const deleteCard = async (req, res, next) => {
    const { titulo } = req.body;
    //console.log(titulo)
    try {
        await knex('post').where('titulo', titulo).del();

        return res.status(200)
    } catch (error) {
        console.error(error);
        return res.status(500)
    }
};

const editPost = async (req, res) => {
    const tituloSearch = req.params.title;
   
    const { titulo, introducao, assunto, conclusao } = req.body;

    //console.log('editPost - tituloSearch:', tituloSearch);
    
    try {
        const updateValues = {};
        if (titulo) updateValues.titulo = titulo;  
        if (introducao) updateValues.introducao = introducao;
        if (assunto) updateValues.desenvolvimento = assunto;
        if (conclusao) updateValues.conclusao = conclusao;

        if (Object.keys(updateValues).length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum valor foi fornecido para atualização.' });
        }

        const result = await knex('post')
            .where('titulo', tituloSearch)
            .update(updateValues);

        if (result > 0) {
            return res.status(200).redirect(`/posts/update/${encodeURIComponent(titulo)}`);

        } else {
            console.error('Nenhuma linha foi atualizada.');
            return res.status(404).json({ mensagem: 'Post não encontrado ou não foi modificado.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao editar o post.' });
    }
}







module.exports = {
    deleteCard,
    editPost
}
