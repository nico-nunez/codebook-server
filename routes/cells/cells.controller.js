const { catchAsync } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

const TABLE = 'cells';

module.exports.getAllCells = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const cells = await models.findAll(TABLE, { limit, offset });
	res.status(200).json(cells);
});

module.exports.insertCell = catchAsync(async (req, res, next) => {
	const newCell = await models.insertOne(TABLE, req.body);
	res.status(201).json(newCell);
});

module.exports.getCellById = catchAsync(async (req, res, next) => {
	const cell = await models.findOneById(TABLE, req.params.id);
	res.status(200).json(cell);
});

module.exports.updateCellById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const { order_index } = req.body;
	await models.updateOneById(TABLE, id, { order_index });
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
