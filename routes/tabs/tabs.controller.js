const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

const TABLE = 'tabs';

module.exports.getAllTabs = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const tabs = await models.findAll(TABLE, { limit, offset });
	res.status(200).json(tabs);
});

module.exports.insertTab = catchAsync(async (req, res, next) => {
	const newTab = {
		cell_id: req.params.id,
		code_language: req.body.code_language,
	};
	const insertedTab = await models.insertOne(TABLE, newTab);
	res.status(201).json(insertedTab);
});

module.exports.getTabById = catchAsync(async (req, res, next) => {
	const cell = await models.findOneById(TABLE, req.params.id);
	res.status(200).json(cell);
});

module.exports.updateTabsOrderByCellId = catchAsync(async (req, res, next) => {
	const cell_id = req.params.id;
	const { tabs_order } = req.body;
	await models.updateOrderIndexes(TABLE, cell_id, tabs_order);
	res.status(204).json({});
});

module.exports.getTabsByCellId = catchAsync(async (req, res, next) => {
	const cells = await models.findManyByColumns(TABLE, {
		cell_id: req.params.id,
	});
	res.status(200).json(cells);
});

module.exports.deleteTabById = catchAsync(async (req, res, next) => {
	await models.deleteOneById(TABLE, req.params.id);
	res.status(204).json({});
});
