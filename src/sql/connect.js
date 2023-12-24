const knex = require('knex');
const mongoose = require('mongoose');
require('dotenv').config();

// Knex for PostgreSQL
const postgresknex = knex({
    client: 'pg',
    connection: {
        user: 'lbrovmjk',
        host: 'isabelle.db.elephantsql.com',
        database: 'lbrovmjk',
        password: 'T28jE2cC6AmzN6OFpBsc5X3DUYY95eAm',
    },
});

// Mongoose for MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDb connected');
}).catch((error) => {
    console.log(error);
});

module.exports = {
    knex: postgresknex,
    mongoose: mongoose,
};
