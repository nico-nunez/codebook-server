const router = require('express').Router();
const usersController = require('./users.controller');
const { isLoggedIn, isUser } = require('../../middleware/validators');
const { validUserData } = require('./users.validtors');

// @desc All Users
// @route Public
router.get('/', usersController.getAllUsers);

// @desc User by ID
// @route Private
router.get('/:id', isLoggedIn, usersController.getUserById);

// @desc Update User
// @route Private (strict)
router.put('/:id', isUser, validUserData, usersController.updateUserById);

// @desc Delete User
// @route Private (strict)
router.delete('/:id', isUser, usersController.deleteUserById);

module.exports = router;
