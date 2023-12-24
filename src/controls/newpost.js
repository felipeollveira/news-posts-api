const autor = 'felipeoliveira'

const { criarArquivoJSON } = require('../api/api');
const Post = require('../sql/models/posts')

const post_go_db = async (req, res, next) => {
    const titulo = req.body.titulo;
    const introducao = req.body.introducao;
    const desenvolvimento = req.body.assunto;
    const conclusao = req.body.conclusao;
    const imagem = req.body.images;
    const timestamp = new Date().toISOString();

    try {
        if (!titulo || !desenvolvimento || !conclusao || !introducao) return res.status(401).send({ message: 'Dados inválidos' });

        const existsTitulo = await Post.findOne({ titulo });

        if (existsTitulo) {
            return res.status(401).json({ mensagem: 'Uma publicação já foi feita com esse mesmo título!' });
        }

        const newPost = await Post.create({ titulo, introducao, desenvolvimento, conclusao, data: timestamp, autor, images: imagem });

        if (!newPost) return res.status(400).send({ message: 'Erro ao criar o post' });

        console.log(JSON.stringify(req.body.images));
        res.status(204).send({ message: 'Publicado!' });
        criarArquivoJSON()
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Erro no servidor' });
    }
};

module.exports = {
    post_go_db,
};