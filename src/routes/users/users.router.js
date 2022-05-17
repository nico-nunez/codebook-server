const router = require('express').Router();
const users = require('./users.controller');
const pages = require('../pages/pages.controller');
const { isLoggedIn, isUser } = require('../../middleware/validators');
const { validUserUpdate } = require('./users.validtors');

router.route('/').get(users.getAllUsers);

router
	.route('/:user_id')
	.get(isLoggedIn, users.getUserById)
	.put(isLoggedIn, isUser, validUserUpdate, users.updateUserById)
	.delete(isLoggedIn, isUser, users.deleteUserById);

router.route('/:user_id/pages').get(pages.getPagesByUserId);

module.exports = router;
