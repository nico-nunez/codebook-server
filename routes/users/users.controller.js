const { catchAsync, throwError } = require('../../utils/error');
const models = require('../../models/models');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
	const limit = Math.min(Number(req.query.limit || 20), 100);
	const page = Math.max(Number(req.query.page || 0), 1);
	const offset = Math.max(limit * (page - 1), 0);
	const allUsers = await models.findAll('users', { limit, offset });
	const users = allUsers.map((user) => {
		delete user.hash;
		return user;
	});
	res.status(200).json(users);
});

module.exports.getUserById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const user = await models.findOneById('users', id);
	if (!user) throwError(['User not found'], 404);
	delete user.hash;
	res.status(200).json(user);
});

module.exports.updateUserById = catchAsync(async (req, res, next) => {
	const { params, body } = req;
	const userFound = await models.updateOneById('users', params.id, body);
	if (!userFound) throwError(['User not found.'], 404);
	res.status(204).json({});
});

module.exports.deleteUserById = catchAsync(async (req, res, next) => {
	await models.deleteOneById('users', req.params.id);
	res.status(204).json({});
});
