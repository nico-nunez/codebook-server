const { throwError } = require('./error');

// @desc Joi input validator
module.exports.validateInput = (joiSchema, req) => {
	const { value, error } = joiSchema.validate(req.body);
	if (error) {
		const messages = error.details.map((err) => err.message).join(',');
		throwError(messages, 400);
	}
	req.body = value;
};

// @desc Pagination for getAll... routes
module.exports.pagination = (pageNum = 1, limitNum = 20) => {
	const limit = Math.min(Number(limitNum || 20), 100);
	const page = Math.max(Number(pageNum || 0), 1);
	const offset = Math.max(limit * (page - 1), 0);
	return { limit, page, offset };
};
