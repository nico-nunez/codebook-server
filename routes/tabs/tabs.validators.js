const Joi = require('joi');
const { validateInput } = require('../../utils/utils');

const languageSchema = Joi.string()
	.trim()
	.lowercase()
	.valid('html', 'css', 'javascript')
	.required()
	.messages({
		'any.required': 'code_language is required',
	});

const orderSchema = Joi.array()
	.items(Joi.number().required())
	.required()
	.messages({
		'any.required': 'cells_order is required',
		'number.base': 'Must be an array of numbers (id).',
	});

module.exports.validTab = (req, res, next) => {
	const tabSchema = Joi.object({
		code_language: languageSchema,
	});
	validateInput(tabSchema, req);
	return next();
};

module.exports.validTabsOrder = (req, res, next) => {
	const tabsOrderSchema = Joi.object({
		tabs_order: orderSchema,
	});
	validateInput(tabsOrderSchema, req);
	return next();
};
