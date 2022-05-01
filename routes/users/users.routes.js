const router = require('express').Router();
const usersController = require('./users.controller');
const { validUserData } = require('./users.validtors');

// @desc All Users
// @route Public
router.get('/', usersController.getAllUsers);

// @desc User by ID
// @route Public??
router.get('/:id', usersController.getUserById);

// @desc Update User
// @route Private
router.put('/:id', validUserData, usersController.updateUserById);

// @desc Delete User
// @route Private
router.delete('/:id', usersController.deleteUserById);

module.exports = router;
