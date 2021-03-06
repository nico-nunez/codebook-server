const router = require('express').Router();
const db = require('../../config/db');
const usersController = require('./users.controller');

// @desc All Users
// @route GET
router.get('/', usersController.getAllUsers);

// @desc User by ID
// @route GET
router.get('/:id', usersController.getUserById);

// @desc Update User
// @route PUT
router.put('/:id', usersController.updateUserById);

// @desc Delete User
// @route DELETE
router.delete('/:id', usersController.deleteUserById);

module.exports = router;
