const mysql = require('mysql2/promise');

const connectionPool = () => {
	const pool = mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});
	console.log('Connected to db...');
	return pool;
};

module.exports = connectionPool();
