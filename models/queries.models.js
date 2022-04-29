module.exports.insertMany = (table = '', items = []) => {
	const columns = Object.keys(items[0]);
	const len = columns.length;
	const placeHolders = '?, '.repeat(len).slice(0, -2);
	const queryBase = `INSERT INTO ${table}(${columns.join(', ')}) VALUES`;
	const queryValues = ` (${placeHolders}),`.repeat(len).slice(0, -1);
	return queryBase + queryValues;
};

module.exports.insertOne = (table = '', item) => {
	const columns = Object.keys(item);
	const placeHolders = '?, '.repeat(columns.length).slice(0, -2);
	const query = `INSERT INTO ${table}(${columns.join(
		', '
	)}) VALUES (${placeHolders})`;
	return query;
};

module.exports.updateOneById = (table = '', data = {}) => {
	let keys = Object.keys(data);
	const initVal = `UPDATE ${table} SET`;
	const result = keys.reduce((prev, key) => {
		return `${prev} ${key}=?`;
	}, initVal);
	return result + ' WHERE id=?';
};
