const models = require('../../models/models');
const { pagination } = require('../../utils/utils');
const { catchAsync, throwError } = require('../../utils/error');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const foundUsers = await models.findAll('users', { limit, offset });
	const users = foundUsers.map((user) => {
		delete user.hash;
		return user;
	});
	res.status(200).json({ users, pagination: { page, limit } });
});

module.exports.getUserById = catchAsync(async (req, res, next) => {
	const { user_id = null } = req.params;
	const user = await models.findOneById('users', user_id);
	if (!user) throwError(['User not found'], 404);
	delete user.hash;
	res.status(200).json(user);
});

module.exports.updateUserById = catchAsync(async (req, res, next) => {
	const { user_id = null } = req.params;
	await models.updateOneById('users', user_id, req.body);
	res.status(204).json();
});

module.exports.deleteUserById = catchAsync(async (req, res, next) => {
	const { user_id = null } = req.params;
	await models.deleteOneById('users', user_id);
	res.status(204).json();
});

module.exports.getPagesByUserId = catchAsync(async (req, res, next) => {
	const { user_id = null } = req.params;
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const user = await models.findOneById('users', user_id);
	if (!user) throwError(['User not found.'], 404);
	const pages = await models.findAllPagesByUserId(user.id, { limit, offset });
	res.status(200).json({ pages, pagination: { limit, offset } });
});
