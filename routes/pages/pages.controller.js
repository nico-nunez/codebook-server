const db = require('../../config/db');
const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const queries = require('../../models/queries.models');

const TABLE = 'pages';

module.exports.getAllPages = catchAsync(async (req, res, next) => {
	const limit = Math.min(Number(req.query.limit || 20), 100);
	const page = Math.max(Number(req.query.page || 0), 1);
	const offset = Math.max(limit * (page - 1) + 1, 1);
	const allPages = models.findAll(TABLE, { limit, offset });
	res.status(200).json(allPages);
});

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
