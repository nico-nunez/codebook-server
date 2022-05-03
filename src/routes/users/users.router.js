const router = require('express').Router();
const controller = require('./users.controller');
const { isLoggedIn, isUser } = require('../../middleware/validators');
const { validUserUpdate } = require('./users.validtors');

router.route('/').get(controller.getAllUsers);

router
	.route('/:user_id')
	.get(isLoggedIn, controller.getUserById)
	.put(isLoggedIn, isUser, validUserUpdate, controller.updateUserById)
	.delete(isLoggedIn, isUser, controller.deleteUserById);

router.route('/:user_id/pages').get(controller.getPagesByUserId);

module.exports = router;
