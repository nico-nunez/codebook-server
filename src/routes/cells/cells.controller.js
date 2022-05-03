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

module.exports.getAllTabsByCellId = catchAsync(async (req, res, next) => {
	const { cell_id } = req.params;
	const tabs = await models.findManyByColumns('tabs', {
		cell_id,
	});
	res.status(200).json(tabs);
});

module.exports.insertTabByCellId = catchAsync(async (req, res, next) => {
	const { cell_id } = req.params;
	const { code_language, content } = req.body;
	const cell = await models.findOneById('cells', cell_id);
	if (cell.cell_type === 'text')
		throwError(['Cannot add "tab" to cell_type [text]'], 400);
	const insertedTab = await models.insertOne('tabs', {
		cell_id,
		code_language,
		content,
	});
	res.status(201).json(insertedTab);
});

module.exports.updateTabsOrderByCellId = catchAsync(async (req, res, next) => {
	const { cell_id } = req.params;
	const { tabs_order } = req.body;
	const cellTabs = await models.findManyByColumns('tabs', { cell_id });
	if (!cellTabs) throwError(['"cell" does not contain any tabs'], 400);
	const sortedTabsOrder = [...tabs_order].sort();
	const sortedTabIds = cellTabs.map((tab) => tab.id).sort();
	sortedTabsOrder.forEach((tabId, i) => {
		if (tabId !== sortedTabIds[i])
			throwError(['"tabs_order" is missing or contains invalid id(s).'], 400);
	});
	await models.updateOrderIndexes('tabs', cell_id, tabs_order);
	res.status(204).json();
});
