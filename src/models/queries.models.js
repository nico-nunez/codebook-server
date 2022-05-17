module.exports.defaultOptions = {
	limit: Infinity,
	offset: 0,
};

module.exports.insertMany = (table, data = []) => {
	const columns = Object.keys(data[0]);
	const queryBase = `INSERT INTO ${table}(${columns.join(', ')}) VALUES`;
	const queryValues = ` (?),`.repeat(data.length).slice(0, -1);
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
		return `${prev} ${col}=? AND `;
	}, initVal);
	return query.slice(0, -4);
};

module.exports.updateOrderIndex = (table) => {
	const foreignId = table === 'cells' ? 'cells.page_id' : 'tabs.cell_id';
	const query = `UPDATE ${table} SET order_index = FIELD(id,?) WHERE ${foreignId}=?`;
	return query;
};

module.exports.findAuthorById = (table) => {
	return `SELECT DISTINCT users.id, users.profile_id, users.profile_name FROM users JOIN pages ON pages.user_id=users.id LEFT JOIN cells ON cells.page_id=pages.id LEFT JOIN tabs ON tabs.cell_id=cells.id WHERE ${table}.id=?`;
};

module.exports.upsertOne = (table, data = {}) => {
	const columns = Object.keys(data);
	const initialQuery = `INSERT INTO ${table} (${columns.join(
		', '
	)}) VALUES (?) AS item ON DUPLICATE KEY UPDATE `;
	const query = columns.reduce((prev, col) => {
		if (col !== 'id') return (prev += `${col}=item.${col}, `);
		return prev;
	}, initialQuery);
	return query.slice(0, -2);
};

module.exports.upsertMany = (table, items = []) => {
	const numItems = items.length;
	const columns = Object.keys(items[0]);
	const values = '(?), '.repeat(numItems).slice(0, -2);
	const initialQuery = `INSERT INTO ${table} (${columns.join(
		', '
	)}) VALUES ${values} AS item ON DUPLICATE KEY UPDATE `;
	const query = columns.reduce((prev, col) => {
		if (col !== 'id') return (prev += `${col}=item.${col}, `);
		return prev;
	}, initialQuery);
	return query.slice(0, -2);
};
