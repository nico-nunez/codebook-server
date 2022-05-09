const Joi = require('joi');
const { validateInput } = require('../../utils/utils');
const { cellSchema } = require('../cells/cells.validators');
const { tabSchema } = require('../tabs/tabs.validators');

const pageNameSchema = Joi.string().max(50).trim().required().messages({
	'any.required': 'page_name required',
	'string.max': 'page_name cannot exceed 50 characters.',
	'string.empty': 'page_name cannot be empty.',
});

module.exports.validPage = (req, res, next) => {
	const updateSchema = Joi.object({
		page_name: pageNameSchema,
		cells: Joi.array().items(cellSchema),
		tabs: Joi.array().items(tabSchema),
	});
	validateInput(updateSchema, req);
	return next();
};
