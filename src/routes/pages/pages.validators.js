const Joi = require('joi');
const { validateInput } = require('../../utils/utils');
const { cellSchema } = require('../cells/cells.validators');
const { tabSchema } = require('../tabs/tabs.validators');

const idSchema = Joi.alternatives().try(Joi.number(), Joi.string()).required();

const pageNameSchema = Joi.string().max(50).trim().required().messages({
	'any.required': 'page_name required',
	'string.max': 'page_name cannot exceed 50 characters.',
	'string.empty': 'page_name cannot be empty.',
});

const pageSchema = Joi.object({
	id: idSchema,
	page_name: pageNameSchema,
	user_id: Joi.number(),
	created_at: Joi.date(),
	updated_at: Joi.date(),
});

module.exports.validPageFull = (req, res, next) => {
	const fullPageSchema = Joi.object({
		page: pageSchema,
		cells: Joi.array().items(cellSchema),
		tabs: Joi.array().items(tabSchema),
	});
	validateInput(fullPageSchema, req);
	return next();
};

module.exports.validPage = (req, res, next) => {
	validateInput(pageNameSchema, req);
	return next();
};
