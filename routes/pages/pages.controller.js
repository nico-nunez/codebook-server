const db = require('../../config/db');

module.exports.getAllPages = async (req, res) => {
	const [result, fields] = await db.query('SELECT * FROM pages');
	res.status(200).json(result);
};

module.exports.getPageById = async (req, res) => {
	const { id } = req.params;
	const pageQuery = 'SELECT * FROM pages WHERE pages.id=?';
	const cellsQuery = 'SELECT * FROM cells WHERE page_id=?';
	const tabsQuery = 'SELECT * FROM tabs WHERE cell_id IN (?)';
	const [page, pageFields] = await db.execute(pageQuery, [Number(id)]);
	const [cells, cellsFields] = await db.execute(cellsQuery, [Number(id)]);
	const [tabs, tabsFields] = await db.query(tabsQuery, [
		cells.map((cell) => cell.id),
	]);
	res.status(200).json({ page: page[0], cells, tabs });
};

module.exports.getPageByIdMin = async (req, res) => {
	const { id } = req.params;
	const pageQuery = 'SELECT * FROM pages WHERE pages.id=?';
	const [page, pageFields] = await db.execute(pageQuery, [Number(id)]);
	res.status(200).json({ page: page[0] });
};
