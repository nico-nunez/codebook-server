const { catchAsync } = require('../../utils/error');
const bcrypt = require('bcrypt');
const randomID = require('../../utils/randomID');
const models = require('../../models/models');

module.exports.register = catchAsync(async (req, res, next) => {
	const { email, password, profile_name } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const newUser = {
		email,
		profile_id: randomID(16, 'alphaNumeric', 'mixed'),
		profile_name: '',
		profile_provider: 'local',
		hash,
	};
	const user = await models.insertOne('users', newUser);
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
