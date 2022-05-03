const { table } = require('console');
const { db } = require('../config/db');
const { throwError } = require('../utils/error');
const queries = require('./queries.models');

const findAllOptions = {
	limit: 20,
	offset: 1,
};

module.exports.findAll = async (table, options = findAllOptions) => {
	try {
		const findAllQuery = `SELECT * FROM ${table} LIMIT ${options.limit} OFFSET ${options.offset}`;
		const [result, fields] = await db.execute(findAllQuery);
		return result;
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.findOneById = async (table, id) => {
	try {
		const findQuery = `SELECT * FROM ${table} WHERE id=?`;
		const [result, fields] = await db.execute(findQuery, [id]);
		return result[0];
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.findManyByColumns = async (
	table,
	filters = { column: value }
) => {
	try {
		const query = queries.findByColumns(table, filters);
		const [result, fields] = await db.execute(query, Object.values(filters));
		return result;
	} catch (err) {
		console.log(err);
		throwError([err.message], 400);
	}
};

module.exports.findOneByColumns = async (
	table,
	filters = { column: value }
) => {
	try {
		const query = queries.findByColumns(table, filters);
		const [result, fields] = await db.execute(
			query + ' LIMIT 1',
			Object.values(filters)
		);
		return result[0];
	} catch (err) {
		console.log(err);
		throwError([err.message], 400);
	}
};

module.exports.insertOne = async (table, data) => {
	try {
		const insertQuery = queries.insertOne(table, data);
		const values = Object.values(data).map((value) => value || null);
		const [result, fields] = await db.execute(insertQuery, values);
		const savedItem = await this.findOneById(table, result.insertId);
		return savedItem;
	} catch (err) {
		if (err.errno === 1062) throwError(['Already exists'], 409);
		if (err.errno === 1452)
			throwError(['Forgein key references row that does not exist'], 409);
		throwError([err.message], 400);
	}
};

//TODO ???
// module.exports.insertMany = async (table, data = []) => {
// 	try {
// 		const insertQuery = queries.insertMany(table, data);
// 		const values = data.map((item) => Object.values(item));
// 		return values;
// 	} catch (err) {
// 		throwError([err.message], 400);
// 	}
// };

module.exports.updateOneById = async (table, id, data) => {
	try {
		const updateQuery = queries.updateOneById(table, data);
		const values = Object.values(data).map((value) => value || null);
		const [result, fields] = await db.execute(updateQuery, [...values, id]);
		return result.affectedRows > 0;
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.deleteOneById = async (table, id) => {
	try {
		const deleteQuery = `DELETE FROM ${table} WHERE id=?`;
		const [result, fields] = await db.execute(deleteQuery, [id]);
		return result.affectedRows > 0;
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.updateOrderIndexes = async (table, id, idArr = []) => {
	try {
		const query = queries.updateOrderIndex(table);
		const [result, fields] = await db.query(query, [idArr, id]);
		return result.affectedRows > 0;
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.findAuthorById = async (table, id) => {
	try {
		const query = queries.findAuthorById(table);
		const [result, fields] = await db.execute(query, [id]);
		if (!result[0]) return;
		return result[0];
	} catch (err) {
		throwError([err.message], 400);
	}
};
