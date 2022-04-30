const router = require('express').Router();
const cellsController = require('./cells.controllers');

// @desc All Cells
// @route GET
router.get('/', cellsController.getAllCells);

// @desc Insert Cell
// @route POST
router.post('/', cellsController.insertCell);

// @desc Cell by ID
// @route GET
router.get('/:id', cellsController.getCellById);

// @desc Update Cell by ID
// @route PUT
router.put('/:id', cellsController.updateCellById);

// @desc All Cells by Page ID
// @route GET
router.get('/pages/:id', cellsController.getCellsByPageId);

// @desc Delete Cell by ID
// @route DELETE
router.delete('/:id', cellsController.deleteCellById);

module.exports = router;
