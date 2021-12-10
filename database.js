const Pool = require('pg').Pool;
const pool = new Pool({
 user: "postgres",
 password: "Hj88Vb77Ty99",
 database: "wadh4",
 host: "localhost",
 port: "5432"
});
module.exports = pool;