const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  database: process.env.database,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};