const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/pagination');

const TABLE = 'tabs';

module.exports.getAllTabs = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const tabs = await models.findAll(TABLE, { limit, offset });
	res.status(200).json(tabs);
});

module.exports.insertTab = catchAsync(async (req, res, next) => {
	const newCell = await models.insertOne(TABLE, req.body);
	res.status(201).json(newCell);
});

module.exports.getTabById = catchAsync(async (req, res, next) => {
	const cell = await models.findOneById(TABLE, req.params.id);
	res.status(200).json(cell);
});

module.exports.updateTabById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	await models.updateOneById(TABLE, id, req.body);
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
