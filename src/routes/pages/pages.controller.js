const { db } = require('../../config/db');
const { catchAsync, throwError } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

module.exports.getAllPages = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const pages = await models.findAll('pages', { limit, offset });
	res.status(200).json({ pages, details: { page, limit } });
});

module.exports.getPageById = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	const page = await models.findOneById('pages', page_id);
	if (!page) throwError(['"page" does not exist'], 404);
	const cells = await models.findManyByColumns('cells', {
		page_id,
	});
	const cellIds = cells.length ? cells.map((cell) => cell.id) : null;
	const tabsQuery = 'SELECT * FROM tabs WHERE cell_id IN (?)';
	const [tabs, fields] = await db.query(tabsQuery, [cellIds]);
	res.status(200).json({ page, cells, tabs });
});

module.exports.insertPage = catchAsync(async (req, res, next) => {
	const { page_name = null } = req.body;
	const user_id = req.user.id;
	const page = await models.insertOne('pages', { page_name, user_id });
	res.status(201).json(page);
});

module.exports.updatePageById = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	await models.updateOneById('pages', page_id, req.body);
	res.status(204).json({});
});

module.exports.deletePageById = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	await models.deleteOneById('pages', page_id);
	res.status(204).json({});
});

module.exports.getCellsByPageId = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	const page = await models.findOneById('pages', page_id);
	if (!page) throwError(['"page" does not exist'], 404);
	const cells = await models.findManyByColumns('cells', { page_id });
	res.status(200).json(cells);
});

module.exports.insertCellByPageId = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	const newCell = await models.insertOne('cells', { ...req.body, page_id });
	res.status(201).json(newCell);
});

module.exports.updateCellsOrder = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	const { cells_order } = req.body;
	const pageCells = await models.findManyByColumns('cells', { page_id });
	if (!pageCells) throwError(['"page" does not contain any cells'], 400);
	const sortedCellsOrder = [...cells_order].sort();
	const sortedCellIds = pageCells.map((cell) => cell.id).sort();
	sortedCellsOrder.forEach((cell, i) => {
		if (cell !== sortedCellIds[i])
			throwError(['"cells_order" is missing or contains invalid id(s).'], 400);
	});
	await models.updateOrderIndexes('cells', page_id, cells_order);
	res.status(204).json({});
});
