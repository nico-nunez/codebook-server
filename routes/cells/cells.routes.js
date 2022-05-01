const router = require('express').Router();
const cellsController = require('./cells.controller');
const { validCellInsert, validOrderUpdate } = require('./cells.validators');

// @desc All Cells
// @route Public
router.get('/', cellsController.getAllCells);

// @desc Insert Cell by Page Id
// @route Private
router.post('/pages/:id', validCellInsert, cellsController.insertCellByPageId);

// @desc Cell by ID
// @route Pivate??
router.get('/:id', cellsController.getCellById);

// @desc All Cells by Page ID
// @route Private??
router.get('/pages/:id', cellsController.getCellsByPageId);

// @desc Update Cells Order by Page ID
// @route Private
router.put('/pages/:id', validOrderUpdate, cellsController.updateOrderByPageId);

// @desc Delete Cell by ID
// @route Private
router.delete('/:id', cellsController.deleteCellById);

module.exports = router;
