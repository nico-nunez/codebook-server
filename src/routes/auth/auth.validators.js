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
	.required()
	.messages({
		'any.required': 'Valid email is required.',
		'string.email': 'Invalid email.',
	});

const passwordSchema = Joi.string()
	.pattern(
		new RegExp(
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
		)
	)
	.required()
	.messages({
		'any.required': 'Password required.',
		'string.pattern.base':
			'Password must contain at least: 8 characters, uppercase, lowercase, number, and special character [!@$%&*?].',
	});

const confirmSchema = Joi.string()
	.required()
	.valid(Joi.ref('password'))
	.messages({
		'any.required': 'Must confirm password.',
		'any.only': 'Passwords must match.',
	});

const profileNameSchema = Joi.string().max(50).trim().required().messages({
	'string.max': 'profile_name cannot exceed 50 characters.',
	'string.empty': 'profile_name cannot be empty.',
});

module.exports.validRegistration = (req, res, next) => {
	const userSchema = Joi.object({
		email: emailSchema,
		password: passwordSchema,
		confirmPass: confirmSchema,
		profile_name: profileNameSchema,
	});
	validateInput(userSchema, req);
	return next();
};

module.exports.validLogin = (req, res, next) => {
	const loginSchema = Joi.object({
		email: emailSchema,
		password: Joi.string().trim().required().messages({
			'any.required': 'Password required',
		}),
	});
	validateInput(loginSchema, req);
	return next();
};
