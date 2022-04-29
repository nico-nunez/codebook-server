const db = require('../config/db');
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

module.exports.findOneById = async (table, id = 0) => {
	try {
		const findQuery = `SELECT * FROM ${table} WHERE id=?`;
		const [result, fields] = await db.execute(findQuery, [id]);
		return result[0];
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.findOneByColumn = async (table, filter = { column: value }) => {
	try {
		const column = Object.keys(filter)[0];
		const query = `SELECT * FROM ${table} WHERE ${column}=?`;
		const [result, fields] = await db.execute(query, [filter[column]]);
		return result[0];
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.findMany = async (table, filterBy = { filter: value }) => {
	const columns = Object.keys(filterBy);
	try {
		const initVal = `SELECT * FROM ${table} WHERE`;
		const query = columns
			.reduce((prev, col, i) => {
				return `${prev} ${col}=${filterBy[col]},`;
			})
			.slice(0 - 1);

		const [result, fields] = await db.execute(query);
		return result;
	} catch (err) {
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
		throwError([err.message], 400);
	}
};

module.exports.updateOneById = async (table, id, data) => {
	try {
		const updateQuery = queries.updateOneById(table, { ...data });
		const values = Object.values(data).map((value) => value || null);
		const [result, fields] = await db.execute(updateQuery, [...values, id]);
		return result.affectedRows > 0;
	} catch (err) {
		throwError([err.message], 400);
	}
};

module.exports.deleteOneById = async (table = '', id = 0) => {
	try {
		const deleteQuery = `DELETE FROM ${table} WHERE id=?`;
		const [result, fields] = await db.execute(deleteQuery, [id]);
		return result.affectedRows > 0;
	} catch (err) {
		throwError([err.message], 400);
	}
};
