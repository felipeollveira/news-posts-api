const knex = require('../sql/connect')

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



module.exports = {
    deleteCard
}
