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

const orderSchema = Joi.array()
	.items(Joi.number().required())
	.required()
	.messages({
		'any.required': 'cells_order is required',
		'number.base': 'Must be an array of numbers (id).',
	});

module.exports.validCellInsert = (req, res, next) => {
	const insertSchema = Joi.object({
		cell_type: cellTypeSchema,
	});
	validateInput(insertSchema, req);
	return next();
};

module.exports.validOrderUpdate = (req, res, next) => {
	const updateSchema = Joi.object({
		cells_order: orderSchema,
	});
	validateInput(updateSchema, req);
	return next();
};
