const db = require('../config/db');
const utils = require('../models/utils.model');

module.exports.findAllPages = async () => {
	const [result, fields] = await db.execute('SELECT * FROM pages');
	return result;
};

module.exports.findPageById = async (id) => {
	const findQuery = 'SELECT * FROM pages WHERE id=?';
	const [result, fields] = await db.execute(findQuery, [id]);
	return result[0];
};

module.exports.insertPage = async (pageName, userId) => {
	const insertQuery = 'INSERT INTO pages(page_name, user_id) VALUES (?,?)';
	const [result, fields] = await db.execute(query, [pageName, userId]);
	const page = await this.findPageById(result.insertId);
	return result[0];
};

module.exports.updatePageById = async (id, pageName) => {
	const updateQuery = utils.updateOneByIdQuery('pages', { pageName });
	console.log(updateQuery);
	// const [result, fields] = await db.execute(updateQuery, [pageName]);
	// return result[0];
};

module.exports.deletePagyById = async (id) => {
	const deleteQuery = 'UPDAY';
};
