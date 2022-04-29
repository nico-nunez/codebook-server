const db = require('../config/db');

module.exports.insertManyQuery = (table = '', items = []) => {
	const columns = Object.keys(items[0]);
	const len = columns.length;
	const placeHolders = '?, '.repeat(len).slice(0, -2);
	const queryBase = `INSERT INTO ${table}(${columns.join(', ')}) VALUES`;
	const queryValues = ` (${placeHolders}),`.repeat(len).slice(0, -1);
	return queryBase + queryValues;
};

module.exports.insertOneQuery = (table = '', item) => {
	const columns = Object.keys(item);
	const placeHolders = '?, '.repeat(columns.length).slice(0, -1);
	const query = `INSERT INTO ${table}(${columns.join(
		', '
	)}) VALUES (${placeHolders})`;
	return query;
};

module.exports.updateOneByIdQuery = (table = '', data = {}) => {
	let keys = Object.keys(data);
	const initVal = `UPDATE ${table} SET`;
	const result = keys.reduce((prev, key) => {
		return `${prev} ${key}=?`;
	}, initVal);
	return result + ' WHERE id=?';
};

module.exports.findOneById = async (table = '', id = 0) => {
	try {
		const findQuery = `SELECT * FROM ${table} WHERE id=?`;
		const [result, fields] = await db.execute(findQuery, [id]);
		return result[0];
	} catch (error) {
		throw error;
	}
};

module.exports.findOneByAny = async (
	table = '',
	filterBy = { filter: value }
) => {
	const column = Object.keys(filterBy)[0];
	const query = `SELECT * FROM ${table} WHERE ${column}=${filterBy[column]}`;
	const [result, fields] = await db.execute(query);
	return result[0];
};

module.exports.findMany = async (table = '', filterBy = { filter: value }) => {
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
	} catch (error) {
		throw error;
	}
};
