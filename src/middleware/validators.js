const models = require('../models/models');
const { throwError, catchAsync } = require('../utils/error');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		throwError(['Must be logged in'], 403);
	}
	next();
};

module.exports.isAuthor = catchAsync(async (req, res, next) => {
	let recordId, table;
	switch (true) {
		case !!req.params.tab_id:
			recordId = req.params.tab_id;
			table = 'tabs';
			break;
		case !!req.params.cell_id:
			recordId = req.params.cell_id;
			table = 'cells';
			break;
		case !!req.params.page_id:
			recordId = req.params.page_id;
			table = 'pages';
			break;
		default:
			recordId = null;
			table = 'pages';
	}
	if (recordId === null) throwError('An id is required', 400);
	const author = (await models.findAuthorById(table, recordId)) || req.user;
	if (!req.user || req.user.id !== author.id) {
		throwError(['Permision denied'], 403);
	}
	next();
});

module.exports.isUser = catchAsync(async (req, res, next) => {
	const { user_id = null } = req.params;
	const user = await models.findOneById('users', user_id);
	if (!user) throwError(['User not found.'], 404);
	if (!req.user || req.user.id !== user.id) {
		throwError(['Permission denied'], 403);
	}
	next();
});
