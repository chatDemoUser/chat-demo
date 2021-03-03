const { Pool } = require('pg');
const pool = new Pool();
module.exports = {
  query: (text, params) => {
    return pool
      .query(text, params)
      .then((res) => {
        return res;
      })
      .catch((err) => console.error('Error executing query', err.stack));
  },
};
