const Joi = require('joi');
const { validateInput } = require('../../utils/utils');

const cellTypeSchema = Joi.string()
	.trim()
	.lowercase()
	.valid('code', 'text')
	.required()
	.messages({
		'any.required': 'cell_type is required',
		'any.only': 'cell_type must be one of [code, text]',
	});

const orderSchema = Joi.array().items(Joi.number().required()).messages({
	'any.required': 'cells_order is required',
	'number.base': 'Must be an array of numbers (id).',
});

const contentSchema = Joi.string().trim();
const forbidContentSchema = Joi.any().forbidden().messages({
	'any.unknown':
		'"content" not allowed for cell_type [code]. Update tab content instead',
});

module.exports.validCell = (req, res, next) => {
	const cellType = req.body.cell_type;
	const insertSchema = Joi.object({
		cell_type: cellTypeSchema,
		content: cellType === 'text' ? contentSchema : forbidContentSchema,
	});
	validateInput(insertSchema, req);
	return next();
};
module.exports.validCellUpdate = (req, res, next) => {
	const updateSchema = Joi.object({
		content: contentSchema,
	});
	validateInput(updateSchema, req);
	return next();
};

module.exports.validCellsOrder = (req, res, next) => {
	const updateOrderSchema = Joi.object({
		cells_order: orderSchema,
	});
	validateInput(updateOrderSchema, req);
	return next();
};
