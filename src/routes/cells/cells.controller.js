const { catchAsync, throwError } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

module.exports.getAllCells = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const cells = await models.findAll('cells', { limit, offset });
	res.status(200).json({ cells, page });
});

module.exports.getCellById = catchAsync(async (req, res, next) => {
	const { cell_id = null, page_id = null } = req.params;
	const cell = await models.findOneById('cells', cell_id);
	if (!cell) throwError([`"cell" does not exist.`], 404);
	res.status(200).json(cell);
});

module.exports.updateCellById = catchAsync(async (req, res, next) => {
	const { cell_id } = req.params;
	const { content } = req.body;
	const cell = await models.findOneById('cells', cell_id);
	if (cell.cell_type === 'code') {
		throwError(
			[
				'"content" is not allowed for cell_type [code]. Update tab content instead.',
			],
			400
		);
	}
	await models.updateOneById('cells', cell_id, { content });
	res.status(204).json();
});

module.exports.deleteCellById = catchAsync(async (req, res, next) => {
	const { cell_id } = req.params;
	await models.deleteOneById('cells', cell_id);
	res.status(204).json();
});

// PAGES ROUTE
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
