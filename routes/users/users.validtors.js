const Joi = require('joi');
const { validateInput } = require('../../utils/utils');

const emailSchema = Joi.string()
	.email({
		minDomainSegments: 2,
		tlds: {
			allow: ['com', 'net', 'org'],
		},
	})
	.trim()
	.lowercase()
	.messages({
		'any.required': 'email or profile_name required',
		'string.email': 'Invalid email.',
	});

const profileNameSchema = Joi.string().max(50).trim().messages({
	'string.max': 'profile_name cannot exceed 50 characters.',
	'string.empty': 'profile_name cannot be empty.',
});

module.exports.validUserData = (req, res, next) => {
	const { profile_name, email } = req.body;
	const userSchema = Joi.object({
		email: profile_name ? emailSchema : emailSchema.required(),
		profile_name: profileNameSchema,
	});
	validateInput(userSchema, req);
	return next();
};
