const Joi = require('joi');
const { validateInput } = require('../../utils/utils');

const pageNameSchema = Joi.string().max(50).trim().required().messages({
	'any.required': 'page_name required',
	'string.max': 'page_name cannot exceed 50 characters.',
	'string.empty': 'page_name cannot be empty.',
});

module.exports.validPage = (req, res, next) => {
	const pageSchema = Joi.object({
		page_name: pageNameSchema,
	});
	validateInput(pageSchema, req);
	return next();
};
