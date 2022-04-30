module.exports.insertMany = (table, items = []) => {
	const columns = Object.keys(items[0]);
	const len = columns.length;
	const placeHolders = '?, '.repeat(len).slice(0, -2);
	const queryBase = `INSERT INTO ${table}(${columns.join(', ')}) VALUES`;
	const queryValues = ` (${placeHolders}),`.repeat(len).slice(0, -1);
	return queryBase + queryValues;
};

module.exports.insertOne = (table, item) => {
	const columns = Object.keys(item);
	const placeHolders = '?, '.repeat(columns.length).slice(0, -2);
	const query = `INSERT INTO ${table}(${columns.join(
		', '
	)}) VALUES (${placeHolders})`;
	return query;
};

module.exports.updateOneById = (table, data = {}) => {
	let columns = Object.keys(data);
	const initVal = `UPDATE ${table} SET`;
	const result = columns
		.reduce((prev, col) => {
			return `${prev} ${col}=?,`;
		}, initVal)
		.slice(0, -1);
	return result + ' WHERE id=?';
};

module.exports.findByColumns = (table, data = {}) => {
	const columns = Object.keys(data);
	const initVal = `SELECT * FROM ${table} WHERE`;
	const query = columns.reduce((prev, col, i) => {
		return `${prev} ${col}=?,`;
	}, initVal);
	return query.slice(0, -1);
};
