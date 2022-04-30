const db = require('../../config/db');
const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

const TABLE = 'pages';

module.exports.getAllPages = catchAsync(async (req, res, next) => {
	const { limit, page, offset } = pagination(req.query.page, req.query.limit);
	const allPages = await models.findAll(TABLE, { limit, offset });
	res.status(200).json(allPages);
});

module.exports.getPageByIdMin = catchAsync(async (req, res, next) => {
	const page = await models.findOneById(TABLE, req.params.id);
	res.status(200).json(page);
});

module.exports.insertPage = catchAsync(async (req, res, next) => {
	const { page_name, user_id } = req.body;
	const savedPage = await models.insertOne(TABLE, { page_name, user_id });
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
	const page = await models.findOneById(TABLE, id);
	const cells = await models.findManyByColumns('cells', {
		page_id: id,
	});
	const tabsQuery = 'SELECT * FROM tabs WHERE cell_id IN (?)';
	const [tabs, fields] = await db.query(tabsQuery, [
		cells.map((cell) => cell.id),
	]);
	res.status(200).json({ page: page[0], cells, tabs });
});

module.exports.updatePageById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	await models.updateOneById(TABLE, id, req.body);
	res.status(204).json({});
});

module.exports.deletePageById = catchAsync(async (req, res, next) => {
	await models.deleteOneById(TABLE, req.params.id);
	res.status(204).json({});
});
