const Joi = require('joi');
const { validateInput } = require('../../utils/utils');

const pageNameSchema = Joi.string().max(50).trim().required().messages({
	'any.required': 'page_name required',
	'string.max': 'page_name cannot exceed 50 characters.',
	'string.empty': 'page_name cannot be empty.',
});

const orderSchema = Joi.array().items(Joi.number().required()).messages({
	'any.required': 'cells_order is required',
	'number.base': 'Must be an array of numbers (id).',
});

module.exports.validPage = (req, res, next) => {
	const updateSchema = Joi.object({
		page_name: pageNameSchema,
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
