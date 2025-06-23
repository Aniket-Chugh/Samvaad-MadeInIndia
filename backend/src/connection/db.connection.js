import mysql from 'mysql2';
import config from '../config/db.config.js';

const db = await mysql.createConnection({
    host: config.dbConfig.host,
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    database: config.dbConfig.database
});


export default db;
