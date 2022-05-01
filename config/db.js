const mysql = require('mysql2/promise');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

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

module.exports.db = connectionPool();

const sessionStore = new MySQLStore({}, this.db);

module.exports.sessionConfig = {
	store: sessionStore,
	secret: process.env.SESSIONS_SECRET,
	name: 'appSession',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		expires: 1000 * 60 * 60 * 24 * 7 * 2,
	},
};

// module.exports = connectionPool();
