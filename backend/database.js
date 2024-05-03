const pg =require('pg');

const { Pool } = pg;

// Instance of Postgres Interface
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL ,
})

module.exports = pool;