require('dotenv').config()
const { MongoClient } = require('mongodb');
const { notification } = require('./notifcation');
const client = new MongoClient(process.env.MONGODB_URI);

const attVersion = async () => {
    try {
        await client.connect();
        const versionCollection = client.db('posts').collection('version');

        // Obtenha a versão atual
        const currentVersion = await versionCollection.findOne({}, { projection: { _id: 0, v: 1 } });

        // Converta currentVersion.v para número antes de incrementar
        const currentVersionNumber = parseFloat(currentVersion.v);

        // Verifique se o valor de v é um número válido
        if (!isNaN(currentVersionNumber)) {
            // Atualize a versão para +0.1
            const newVersion = (currentVersionNumber + 0.1).toFixed(1);

            // Atualize a versão no banco de dados
            await versionCollection.updateOne({}, { $set: { v: Number(newVersion) } });
            notification()
            console.log(`Versão atualizada para: ${newVersion}`);
        } else {
            console.error('Erro: Valor atual da versão não é um número válido.');
        }
    } catch (error) {
        console.error('Erro ao atualizar a versão:', error);
    } finally {
        await client.close();
    }
};






// Chame a função para realizar a atualização
module.exports = {
    attVersion
}



