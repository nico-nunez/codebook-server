const db = require('../config/db');
const { ExpressError } = require('../utils/error');
const utils = require('./utils.model');
const randomID = require('../utils/randomID');

const baseFindQuery = 'SELECT id, email, profile_id, profile_name FROM users ';

module.exports.findAllUsers = async () => {
	const [result, fields] = await db.execute(baseFindQuery);
	return result;
};

module.exports.findUserById = async (id) => {
	const query = baseFindQuery + 'WHERE id=?';
	const [result, fields] = await db.execute(query, [id]);
	if (result[0]) delete result[0].hash;
	return result[0];
};

module.exports.findUserByEmail = async (email) => {
	const query = baseFindQuery + 'WHERE email=?';
	const [result, fields] = await db.execute(query, [email]);
	return result[0];
};

module.exports.findUserByProfileId = async (profileId) => {
	const query = baseFindQuery + 'WHERE profile_id=?';
	const [result, fields] = await db.execute(query, [profileId]);
	return result[0];
};

module.exports.findUserLocalPassport = async (email) => {
	const [result, fields] = await db.execute(
		'SELECT * FROM users WHERE email=?',
		[email]
	);
	return result[0];
};

module.exports.updateUserById = async (id, data = {}) => {
	try {
		const updateQuery = utils.updateOneByIdQuery('users', data);
		const values = Object.values(data);
		const [result, fields] = await db.execute(updateQuery, [...values, id]);
		return result.affectedRows > 0;
	} catch (err) {
		throw new ExpressError([err.message], 400);
	}
};

module.exports.insertNewUser = async ({
	email = null,
	hash = null,
	profileId = randomID(24),
	profileProvider = 'local',
	profileName = null,
}) => {
	const data = [email, hash, profileId, profileProvider, profileName];
	const newUserQuery = `INSERT INTO users(email, hash, profile_id, profile_provider, profile_name)
  VALUES (?, ?, ?, ?, ?)`;
	try {
		const [result, fields] = await db.execute(newUserQuery, data);
		const user = await this.findUserById(result.insertId);
		return user;
	} catch (error) {
		if (error.errno === 1062)
			throw new ExpressError(['Email already registered.'], 409);
	}
};

module.exports.deleteUserById = async (id) => {
	const [result, fields] = await db.execute('DELETE FROM users WHERE id=?', [
		id,
	]);
	return result.affectedRows > 0;
};
