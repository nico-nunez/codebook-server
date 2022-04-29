const { catchAsync, ExpressError } = require('../../utils/error');
const usersModel = require('../../models/users.model');
const utils = require('../../models/utils.model');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
	const allUsers = await usersModel.findAllUsers();
	res.status(200).json(allUsers);
});

module.exports.getUserById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const user = await usersModel.findUserById(id);
	if (!user) throw new ExpressError(['User not found'], 404);
	res.status(200).json(user);
});

module.exports.updateUserById = catchAsync(async (req, res, next) => {
	const { params, body } = req;
	const userFound = await usersModel.updateUserById(params.id, body);
	if (!userFound) throw new ExpressError(['User not found.'], 404);
	res.status(204).json({});
});

module.exports.deleteUserById = catchAsync(async (req, res, next) => {
	await usersModel.deleteUserById(req.params.id);
	res.status(204).json({});
});
