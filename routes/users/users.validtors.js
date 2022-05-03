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
		'string.email': 'Invalid email.',
	});

const profileNameSchema = Joi.string().max(50).trim().messages({
	'string.max': 'profile_name cannot exceed 50 characters.',
	'string.empty': 'profile_name cannot be empty.',
});

module.exports.validUserUpdate = (req, res, next) => {
	const updateSchema = Joi.object({
		email: emailSchema,
		profile_name: profileNameSchema,
	})
		.min(1)
		.messages({
			'object.min': `Must include at least email or profile name.`,
		});
	validateInput(updateSchema, req);
	return next();
};
