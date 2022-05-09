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
	const { page_name, cells, tabs } = req.body;
	const user_id = req.user.id;
	let savedCells, savedTabs;
	const page = await models.insertOne('pages', {
		page_name,
		user_id,
	});
	if (!page) throwError('page does not exist', 404);
	if (cells && cells.length > 0) {
		const modifiedCells = cells.map((cell) => {
			const { cell_type, content } = { ...cell };
			return { cell_type, content, page_id: page.id };
		});
		savedCells = await models.insertMany('cells', modifiedCells);
	}
	if (tabs && tabs.length > 0) {
		const codeCell = savedCells.find((cell) => cell.cell_type === 'code');
		if (!codeCell) throwError('code cell does not exist', 404);
		const modifiedTabs = tabs.map((tab) => {
			const { code_language, content } = { ...tab };
			return { code_language, content, cell_id: codeCell.id };
		});
		savedTabs = await models.insertMany('tabs', modifiedTabs);
	}
	res.status(201).json({ page, cells: savedCells, tabs: savedTabs });
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
	const { page_id } = req.params;
	const { cell_type, content } = req.body;
	const newCell = await models.insertOne('cells', {
		cell_type,
		content,
		page_id,
	});
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
