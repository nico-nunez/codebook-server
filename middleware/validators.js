const models = require('../models/models');
const { throwError, catchAsync } = require('../utils/error');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		throwError(['Must be logged in'], 403);
	}
	next();
};

module.exports.isAuthor = catchAsync(async (req, res, next) => {
	const pathArr = req.originalUrl.split('/');
	const table = pathArr[pathArr.length - 2];
	const { id } = await models.findAuthorById(table, req.params.id);
	if (!req.user || req.user.id !== id) {
		throwError(['Permision denied'], 403);
	}
	next();
});

module.exports.isUser = catchAsync(async (req, res, next) => {
	const { id } = await models.findOneById('users', req.params.id);
	if (!req.user || req.user.id !== id) {
		throwError(['Permission denied'], 403);
	}
	next();
});
