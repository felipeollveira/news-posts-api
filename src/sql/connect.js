const knex = require('knex')({

    client: 'pg',
    connection: {
        user: 'lbrovmjk',
        host: 'isabelle.db.elephantsql.com',
        database: 'lbrovmjk',
        password: 'T28jE2cC6AmzN6OFpBsc5X3DUYY95eAm',
        
    },
    
})

module.exports = knex