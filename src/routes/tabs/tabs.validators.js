const Joi = require('joi');
const { validateInput } = require('../../utils/utils');

const idSchema = Joi.alternatives().try(Joi.number(), Joi.string()).required();

const languageSchema = Joi.string()
	.trim()
	.lowercase()
	.valid('html', 'css', 'javascript')
	.required()
	.messages({
		'any.required': 'code_language is required',
		'any.only': '"code_language" must be one of [html, css, javascript] only',
	});

const orderSchema = Joi.array()
	.items(Joi.number().required())
	.required()
	.messages({
		'any.required': 'tabs_order is required',
		'number.base': 'Must be an array of numbers (id).',
	});

module.exports.tabSchema = Joi.object({
	id: idSchema,
	cell_id: idSchema,
	code_language: languageSchema,
	content: Joi.string().trim().allow('').allow(null),
	order_index: Joi.number(),
	created_at: Joi.date(),
	updated_at: Joi.date(),
});

module.exports.validTab = (req, res, next) => {
	validateInput(this.tabSchema, req);
	return next();
};

module.exports.validTabsOrder = (req, res, next) => {
	const tabsOrderSchema = Joi.object({
		tabs_order: orderSchema,
	});
	validateInput(tabsOrderSchema, req);
	return next();
};
