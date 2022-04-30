const db = require('../../config/db');
const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const queries = require('../../models/queries.models');

const TABLE = 'pages';

module.exports.getAllPages = catchAsync(async (req, res, next) => {
	const limit = Math.min(Number(req.query.limit || 20), 100);
	const page = Math.max(Number(req.query.page || 0), 1);
	const offset = Math.max(limit * (page - 1), 0);
	const allPages = await models.findAll(TABLE, { limit, offset });
	res.status(200).json(allPages);
});

module.exports.getPageByIdMin = catchAsync(async (req, res, next) => {
	const page = await models.findOneById(TABLE, req.params.id);
	res.status(200).json(page);
});

module.exports.insertPage = catchAsync(async (req, res, next) => {
	const { page_name, user_id } = req.body;
	const newPage = { page_name, user_id };
	const savedPage = await models.insertOne(TABLE, newPage);
	res.status(201).json(savedPage);
});

module.exports.getPagesByUser = catchAsync(async (req, res, next) => {
	const pages = await models.findManyByColumns(TABLE, {
		user_id: req.params.id,
	});
	res.status(200).json(pages);
});

module.exports.getPageByIdFull = catchAsync(async (req, res, next) => {
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
});

module.exports.updatePageById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const query = queries.updateOneById(TABLE, req.body);
	await models.updateOneById(TABLE, id, req.body);
	res.status(204).json({});
});

module.exports.deletePageById = catchAsync(async (req, res, next) => {
	await models.deleteOneById(TABLE, req.params.id);
	res.status(204).json({});
});
