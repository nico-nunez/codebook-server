const { catchAsync } = require('../../utils/error');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const userModel = require('../../models/users.model');

module.exports.register = catchAsync(async (req, res, next) => {
	const { email, password, passwordConf, profileName } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const newUser = {
		email,
		profileName,
		profileProvider: 'local',
		hash,
	};
	const user = await userModel.addNewUser(newUser);
	res.status(201).json(user);
});

module.exports.localLogin = (req, res, next) => {
	res.status(200).json(req.user);
};

module.exports.googleAuth = (req, res) => {
	res.send('oauth flow start');
};

module.exports.googleCallback = (req, res) => {
	res.status(200).json(req.user);
};

module.exports.githubAuth = (req, res) => {
	res.send('oauth flow start');
};

module.exports.githubCallback = (req, res) => {
	res.status(200).json(req.user);
};
