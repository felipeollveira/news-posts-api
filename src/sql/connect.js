const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("posts").command({ ping: 1 });
    console.log("Conectado mongodb");
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
  } 
}

module.exports = {
  run
};
