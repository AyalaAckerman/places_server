
const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'places',
  password: '207594375',
  port: '5432',
})

// const getName = () => {
//     return pool;
//   };

module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
  }