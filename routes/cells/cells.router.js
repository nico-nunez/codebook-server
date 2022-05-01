const router = require('express').Router();
const { isAuthor, isLoggedIn } = require('../../middleware/validators');
const cellsController = require('./cells.controller');
const { validCellInsert, validOrderUpdate } = require('./cells.validators');

// @desc All Cells??
// @route Private
router.get('/', isLoggedIn, cellsController.getAllCells);

// @desc Insert Cell by Page Id
// @route Private
router.post(
	'/pages/:id',
	isLoggedIn,
	validCellInsert,
	cellsController.insertCellByPageId
);

// @desc Cell by ID??
// @route Public
router.get('/:id', cellsController.getCellById);

// @desc All Cells by Page ID
// @route Public
router.get('/pages/:id', cellsController.getCellsByPageId);

// @desc Update Cells Order by Page ID
// @route Private (strict)
router.put(
	'/pages/:id',
	isAuthor,
	validOrderUpdate,
	cellsController.updateOrderByPageId
);

// @desc Delete Cell by ID
// @route Private (strict)
router.delete('/:id', isAuthor, cellsController.deleteCellById);

module.exports = router;
