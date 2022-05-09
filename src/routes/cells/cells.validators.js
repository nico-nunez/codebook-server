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

const contentSchema = Joi.custom((val, helpers) => {
	const { cell_type } = helpers.state.ancestors[0];
	if (cell_type === 'text') return val.trim();
	if (val !== null) return helpers.error('any.invalid');
	return null;
})
	.required()
	.messages({
		'any.invalid':
			'"content" not allowed for cell_type [code]. Update tab content instead',
		'any.required': '"content" is required for all cells.',
	});

module.exports.cellSchema = Joi.object({
	id: Joi.number(),
	cell_type: cellTypeSchema,
	content: contentSchema,
	page_id: Joi.number(),
});

module.exports.validCell = (req, res, next) => {
	validateInput(this.cellSchema, req);
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
