const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

const TABLE = 'cells';

module.exports.getAllCells = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const cells = await models.findAll(TABLE, { limit, offset });
	res.status(200).json(cells);
});

module.exports.insertCellByPageId = catchAsync(async (req, res, next) => {
	const newCell = { ...req.body, page_id: req.params.id };
	const insertedCell = await models.insertOne(TABLE, newCell);
	res.status(201).json(insertedCell);
});

module.exports.getCellById = catchAsync(async (req, res, next) => {
	const cell = await models.findOneById(TABLE, req.params.id);
	res.status(200).json(cell);
});

module.exports.updateOrderByPageId = catchAsync(async (req, res, next) => {
	const page_id = req.params.id;
	const { cells_order } = req.body;
	await models.updateOrderIndexes(TABLE, page_id, cells_order);
	res.status(204).json({});
});

module.exports.getCellsByPageId = catchAsync(async (req, res, next) => {
	const cells = await models.findManyByColumns(TABLE, {
		page_id: req.params.id,
	});
	res.status(200).json(cells);
});

module.exports.deleteCellById = catchAsync(async (req, res, next) => {
	await models.deleteOneById(TABLE, req.params.id);
	res.status(204).json({});
});
